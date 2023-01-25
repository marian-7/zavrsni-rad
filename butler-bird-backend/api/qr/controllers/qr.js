module.exports = {
  generate: async (ctx) => {
    const { services } = strapi;
    const { validateRequest, qrGeneratorSchema } = services.validation;
    const { organization: orgId, locale } = await validateRequest(
      ctx,
      qrGeneratorSchema,
      ctx.request.header
    );

    const [organization] = await Promise.all([
      strapi.services.organization.findOne({
        id: orgId,
      }),
    ]);

    if (!organization) {
      ctx.throw(404);
    }

    let tables;
    if (ctx.query._q) {
      tables = await strapi.services.table.search(ctx.query);
    } else {
      tables = await strapi.services.table.find(ctx.query);
    }

    const buffer = await strapi.services.qr.generate(
      organization,
      tables,
      locale
    );
    ctx.set("Content-Type", "application/pdf");
    return buffer;
  },
};
