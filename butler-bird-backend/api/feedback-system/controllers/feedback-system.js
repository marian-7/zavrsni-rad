"use strict";

async function create(ctx) {
  const { services } = strapi;
  const { validateRequest, feedbackSystemCreateSchema } = services.validation;
  const request = await validateRequest(ctx, feedbackSystemCreateSchema, {
    ...ctx.request.body,
    user: ctx.state.user,
  });

  const installation = await services.installation.verify(ctx);

  const entity = await services["feedback-system"].createOrUpdate(
    request,
    installation
  );

  return ctx.send(services.parser.mapFeedbackSystemResponse(entity));
}

module.exports = {
  create,
};
