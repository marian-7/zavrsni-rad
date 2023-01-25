'use strict';

/**
 * A set of functions called "actions" for `analytics`
 */

async function findSalesOverview(ctx) {
  const {services} = strapi;
  const {validateRequest, analyticsSalesRequestSchema} = services.validation;

  const {startDate, endDate, locations, venues, organization} = await validateRequest(
      ctx,
      analyticsSalesRequestSchema,
      {
        ...ctx.query,
        organization: ctx.request.header.organization,
      },
  );

  const [orders, itemsPerCategory] = await Promise.all([
    services.analytics.findOrders(startDate, endDate, locations, venues, organization),
    services.analytics.findItemsSoldPerCategory(startDate, endDate, locations, venues, organization),
  ]);

  const revenue = await services.analytics.calculateTotalRevenue(orders, organization);
  const revenueDaily = await services.analytics.calculateAverageDailyRevenue(orders, organization);
  const numberOfItemsSold = services.analytics.calculateTotalNumberOfItemsSold(orders);

  return ctx.send({
    revenue,
    revenueDaily,
    numberOfItemsSold,
    itemsPerCategory,
  });
}

async function findSalesBreakdown(ctx) {
  const {services} = strapi;
  const {validateRequest, analyticsSalesRequestSchema} = services.validation;
  const {
    startDate,
    endDate,
    locations,
    venues,
    organization,
  } = await validateRequest(ctx, analyticsSalesRequestSchema, {
    ...ctx.query,
    organization: ctx.request.header.organization,
  });

  const breakdown = await services.analytics.findSalesBreakdown(startDate, endDate, locations, venues, organization);

  return ctx.send(breakdown);
}

async function findOrdersOverview(ctx) {
  const {services} = strapi;
  const {validateRequest, analyticsOrdersRequestSchema} = services.validation;

  const {
    startDate,
    endDate,
    startTime,
    endTime,
    locations,
    venues,
    organization,
  } = await validateRequest(ctx, analyticsOrdersRequestSchema, {
    ...ctx.query,
    organization: ctx.request.header.organization,
  });

  const summary = await services.analytics.findOrdersSummary(
      startDate, endDate, startTime, endTime, locations, venues, organization,
  );

  return ctx.send(summary);
}

async function findOrdersBreakdown(ctx) {
  const {services} = strapi;
  const {validateRequest, analyticsOrdersRequestSchema} = services.validation;

  const {
    startDate,
    endDate,
    startTime,
    endTime,
    locations,
    venues,
    organization,
  } = await validateRequest(ctx, analyticsOrdersRequestSchema, {
    ...ctx.query,
    organization: ctx.request.header.organization,
  });

  const breakdown = await services.analytics.findOrdersBreakdown(
      startDate, endDate, startTime, endTime, locations, venues, organization,
  );

  return ctx.send(breakdown);
}

module.exports = {
  findSalesOverview,
  findSalesBreakdown,
  findOrdersOverview,
  findOrdersBreakdown,
};
