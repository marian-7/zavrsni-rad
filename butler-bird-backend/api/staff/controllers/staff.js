'use strict';

/**
 * A set of functions called "actions" for `staff`
 */

async function remove(ctx) {
  const {services} = strapi;
  const {validateRequest, staffRemoveSchema} = services.validation;
  const {email, organization} = await validateRequest(ctx, staffRemoveSchema, {
    ...ctx.params,
    ...ctx.request.header,
  });

  const staff = await services.staff.removeStaff(organization, email);
  if (staff) {
    return ctx.send(services.parser.mapStaffResponse(staff));
  }
  return ctx.throw(404, 'Staff not found');
}

async function add(ctx) {
  const {services} = strapi;
  const {validateRequest, staffAddSchema} = services.validation;
  const {email, organization} = await validateRequest(ctx, staffAddSchema, {
    ...ctx.request.body,
    ...ctx.request.header,
  });

  const staff = await services.staff.addStaff(organization, email);
  return ctx.send(services.parser.mapStaffResponse(staff));
}

async function find(ctx) {
  const {services} = strapi;
  const {validateRequest, staffFindSchema} = services.validation;
  const {organization} = await validateRequest(ctx, staffFindSchema, {
    ...ctx.query,
    ...ctx.request.header,
  });

  const entities = await services.staff.findStaff(organization, ctx.query);
  return ctx.send(entities.map(services.parser.mapStaffResponse));
}

module.exports = {
  add,
  remove,
  find,
};
