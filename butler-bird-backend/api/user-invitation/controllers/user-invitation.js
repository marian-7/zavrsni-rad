'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function accept(ctx) {
  const {services} = strapi;
  const {validateRequest, invitationAcceptSchema} = services.validation;
  const {
    uid,
    firstName,
    lastName,
    email,
    password,
  } = await validateRequest(ctx, invitationAcceptSchema, ctx.request.body);

  try {
    const result = await services['user-invitation'].finalize(
        uid,
        firstName,
        lastName,
        email,
        password,
    );
    return ctx.send(result);
  } catch (e) {
    return ctx.throw(400, e);
  }
}

module.exports = {
  accept,
};
