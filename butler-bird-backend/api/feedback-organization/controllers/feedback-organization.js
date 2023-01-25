'use strict';

async function findOne(ctx) {
  const {services} = strapi;
  const {validateRequest, feedbackOrganizationFindSchema} = services.validation;
  const {
    organization,
    installation,
    user,
  } = await validateRequest(ctx, feedbackOrganizationFindSchema, {
    user: ctx.state.user,
    installation: ctx.query.installation,
    organization: ctx.params.organization,
  });

  const entity = await services['feedback-organization'].findOneBy({
    user,
    installation,
    organization,
  });
  if (!entity) {
    ctx.throw(404);
  }

  return ctx.send(services.parser.mapFeedbackOrganizationResponse(entity));
}

async function create(ctx) {
  const {services} = strapi;
  const {validateRequest, feedbackOrganizationCreateSchema} = services.validation;
  const request = await validateRequest(ctx, feedbackOrganizationCreateSchema, {
    ...ctx.request.body,
    user: ctx.state.user,
  });

  const installation = await services.installation.verify(ctx);

  const entity = await services['feedback-organization'].createOrUpdate(request, installation);

  return ctx.send(services.parser.mapFeedbackOrganizationResponse(entity));
}

module.exports = {
  create,
  findOne,
};
