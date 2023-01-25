'use strict';

/**
 * `staff` service.
 */

const {get, uniqBy} = require('lodash');

async function findStaff(organization) {
  const knex = strapi.connections.default;

  const staffQuery = knex('organizations').
      innerJoin('organizations__staff', 'organizations.id', 'organizations__staff.organization_id').
      innerJoin('users-permissions_user', 'users-permissions_user.id', 'organizations__staff.user_id').
      where('organizations.id', organization).
      select('users-permissions_user.id as user_id', 'users-permissions_user.email as user_email');

  const invitationsQuery = knex('user_invitations').
      where('user_invitations.organization', organization).
      select('user_invitations.email as invited_email');

  const [staff, invitations] = await Promise.all([
    staffQuery,
    invitationsQuery,
  ]);

  const users = staff.map(it => ({id: it.user_id, email: it.user_email}));
  const invitees = invitations.map(it => ({email: it.invited_email}));

  return uniqBy([...users, ...invitees], 'email');
}

async function insertOrganizationStaff(user, organization) {
  const knex = strapi.connections.default;
  const queryResult = await knex('organizations__staff').
      where('organization_id', organization).
      andWhere('user_id', user);
  if (!queryResult.length) {
    await knex('organizations__staff').insert({
      organization_id: organization,
      user_id: user,
    });
  }
}

async function findExistingUser(email) {
  return strapi.query('user', 'users-permissions').findOne({email}, []);
}

async function addStaff(organizationId, email) {
  let user = await findExistingUser(email);
  if (!user) {
    await strapi.services['user-invitation'].create(email, organizationId);
    user = {email};
  } else {
    await insertOrganizationStaff(user.id, organizationId);
  }

  return {
    id: user.id,
    email: user.email,
  };
}

async function removeStaff(organization, email) {
  const knex = strapi.connections.default;

  const organizationStaffSubQuery = knex('organizations__staff').
      innerJoin('users-permissions_user', 'users-permissions_user.id', 'organizations__staff.user_id').
      where('organizations__staff.organization_id', organization).
      andWhere('users-permissions_user.email', email).select('organizations__staff.id');

  const organizationStaffQuery = knex('organizations__staff').
      whereIn('id', organizationStaffSubQuery).
      delete(['organizations__staff.user_id']);

  const invitationQuery = knex('user_invitations').
      where('organization', organization).
      andWhere('email', email).
      delete();

  const [organizationStaff, invites] = await Promise.all([
    organizationStaffQuery,
    invitationQuery,
  ]);

  if (organizationStaff.length) {
    return {
      id: get(organizationStaff, '[0].user_id'),
      email,
    };
  } else if (invitationQuery.length) {
    return email;
  }
  return null;
}

module.exports = {
  findStaff,
  addStaff,
  removeStaff,
  insertOrganizationStaff,
};
