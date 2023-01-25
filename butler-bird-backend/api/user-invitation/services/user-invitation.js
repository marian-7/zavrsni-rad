'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const {get, pick} = require('lodash');
const {
  v4: uuidv4,
} = require('uuid');

async function findOne(email, organization) {
  return strapi.query('user-invitation').findOne({email, organization});
}

async function create(email, organization) {
  return strapi.query('user-invitation').create({email, organization});
}

async function remove(email, organization) {
  const knex = strapi.connections.default;
  const result = await knex('user_invitations').
      where('organization', organization).
      andWhere('email', email).
      delete(['id', 'email', 'organization', 'invitation']);

  return get(result, '[0]');
}

async function generateUID() {
  return uuidv4();
}

async function createUrl(organization, email, uid) {
  const updated = await strapi.query('user-invitation').update({
    organization,
    email,
  }, {
    invitation: uid,
  });

  const urlSlug = get(updated, 'organization.slug');
  const urlUUID = get(updated, 'invitation');
  const urlEmail = get(updated, 'email');
  const urlBase = get(process, 'env.ADMIN_URL', 'https://admin.butlerbird.com');

  return `${urlBase}/${urlSlug}/invitation/${urlUUID}?email=${urlEmail}`;
}

async function notifyAdded(email, url) {
  await strapi.plugins['email'].services.email.send({
    to: email,
    subject: 'Welcome to ButlerBird!',
    html: `<h1>Congratulations!</h1><br><p>To finalize your registration process, please open <a href="${url}">this link</a></p>`,
  });
}

async function notifyFulfilled(user, organization) {
  await strapi.plugins['email'].services.email.send({
    to: user.email,
    subject: `You've been added to ${organization.name}`,
    html: `<h1>Congratulations!</h1><br><p>We're looking forward to you working with us!</p>`,
  });
}

async function finalize(uid, firstName, lastName, email, password) {
  let user = await strapi.query('user', 'users-permissions').findOne({email, provider: 'local'});
  if (user) {
    throw new Error('User already exists');
  }

  const invitation = await strapi.query('user-invitation').findOne({invitation: uid, email});
  if (!invitation) {
    throw new Error(`There is no invitation for ${uid} and ${email}`);
  }

  const role = await strapi.query('role', 'users-permissions').findOne({type: 'owner'}, []);
  const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword({
    password,
  });
  user = await strapi.query('user', 'users-permissions').create({
    email,
    username: email,
    firstName,
    lastName,
    password: hashedPassword,
    role,
    confirmed: true,
    provider: 'local',
  });

  const invitations = await strapi.query('user-invitation').find({email}, ['organization']);

  await Promise.all(invitations.map(invitation => strapi.services.staff.insertOrganizationStaff(
      get(user, 'id'),
      get(invitation, 'organization.id', invitation.organization),
  ).then(() => strapi.services['user-invitation'].notifyFulfilled(user, invitation.organization))));

  await strapi.query('user-invitation').delete({id_in: invitations.map(it => it.id)});

  return {
    jwt: strapi.plugins['users-permissions'].services.jwt.issue(pick(user, ['id'])),
    user: strapi.services.parser.mapUserResponse(user),
  };
}

module.exports = {
  findOne,
  create,
  remove,
  generateUID,
  createUrl,
  finalize,
  notifyAdded,
  notifyFulfilled,
};
