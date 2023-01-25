"use strict";

/**
 * `analytics` service.
 */
const dayjs = require("dayjs");
const {
  uniqBy,
  sum,
  groupBy,
  mapValues,
  values,
  mean,
  flatten,
  random,
  take,
  map,
  find,
  orderBy,
  maxBy,
} = require("lodash");

async function findOrders(
  startDate,
  endDate,
  locations,
  venues,
  organization,
  includeCanceled = true
) {
  const queryParams = {
    created_at_gt: dayjs(startDate).startOf("day").toDate(),
    created_at_lt: dayjs(endDate).endOf("day").toDate(),
    organization,
    type_null: true,
  };

  if (locations) {
    queryParams.location_in = locations;
  }
  if (venues) {
    queryParams.venue_in = venues;
  }

  if (!includeCanceled) {
    queryParams.canceledAt_null = true;
  }

  return strapi.query("order").find(queryParams);
}

async function getOrganizationCurrencyAndExchangesRate(organizationId) {
  const organization = await strapi.services.organization.findOne(
    { id: organizationId },
    ["currency"]
  );
  const organizationCurrency = organization.currency;
  const exchangeRates = await strapi.services.currency.getExchangeRates(
    organizationCurrency.iso
  );
  return [organizationCurrency, exchangeRates];
}

async function calculateTotalRevenue(orders, organizationId) {
  const [organizationCurrency, exchangeRates] =
    await getOrganizationCurrencyAndExchangesRate(organizationId);

  return sum(
    orders.map((order) => {
      return order.currencySnapshot === organizationCurrency.iso
        ? order.amount
        : order.amount * exchangeRates[order.currencySnapshot];
    })
  );
}

async function calculateAverageDailyRevenue(orders, organizationId) {
  const [organizationCurrency, exchangeRates] =
    await getOrganizationCurrencyAndExchangesRate(organizationId);

  const groupedOrders = groupBy(
    orders.map((it) => ({
      ...it,
      date: dayjs(it.created_at).format("YYYY-MM-DD"),
    })),
    "date"
  );

  const sumPerDay = mapValues(groupedOrders, (orders) => {
    return sum(
      orders.map((order) => {
        return order.currencySnapshot === organizationCurrency.iso
          ? order.amount
          : order.amount * exchangeRates[order.currencySnapshot];
      })
    );
  });

  return mean(values(sumPerDay));
}

function calculateTotalNumberOfItemsSold(orders) {
  const itemAmounts = flatten(orders.map((it) => it.itemsSnapshot)).map(
    (item) => item.amount ?? 1
  );
  return sum(itemAmounts);
}

async function findItemsSoldPerCategory(
  startDate,
  endDate,
  locations,
  venues,
  organization
) {
  const orders = await findOrders(
    startDate,
    endDate,
    locations,
    venues,
    organization,
    false
  );

  const categoriesIds = flatten(
    flatten(orders.map((order) => order.itemsSnapshot)).map((item) => {
      const { amount, categories } = item;
      let idsArray = [];

      if (categories.length === 0) {
        return Array(amount ?? 1).fill(-1);
      }

      for (const categoryId of categories) {
        const arr = Array(amount ?? 1).fill(categoryId);
        idsArray = idsArray.concat(arr);
      }
      return idsArray;
    })
  );

  const categoriesObj = uniqBy(
    flatten(orders.map((order) => order.categoriesSnapshot)),
    (category) => category.id
  ).reduce((obj, category) => {
    if (category.id in obj) return obj;
    obj[category.id] = { id: category.id, name: category.name };
    return obj;
  }, {});

  const categoriesCount = categoriesIds.reduce((obj, categoryId) => {
    if (categoryId in obj) {
      obj[categoryId]++;
    } else {
      obj[categoryId] = 1;
    }
    return obj;
  }, {});

  const categoriesCountArray = Object.keys(categoriesCount)
    .map((key) => ({ id: key, itemsSold: categoriesCount[key] }))
    .sort((c1, c2) => {
      if (+c1.id === -1) return 1;
      if (c1.itemsSold > c2.itemsSold) return -1;
      if (c1.itemsSold < c2.itemsSold) return 1;
      return 0;
    });

  const numberOfBestSelling = 5;

  const bestSellingCount =
    categoriesCountArray.length > numberOfBestSelling
      ? categoriesCountArray.slice(0, numberOfBestSelling)
      : categoriesCountArray.slice(0, categoriesCountArray.length - 1);

  const otherSum =
    categoriesCountArray.length > numberOfBestSelling
      ? sum(
          categoriesCountArray
            .slice(numberOfBestSelling, categoriesCountArray.length)
            .map((it) => it.itemsSold)
        )
      : categoriesCount[-1];

  return [
    ...bestSellingCount.map((it) => ({
      id: it.id,
      name: categoriesObj[+it.id].name,
      itemsSold: it.itemsSold,
    })),
    { itemsSold: otherSum },
  ];
}

function locationsVenuesAndVenuesGroupedByLocation(orders) {
  return [
    uniqBy(
      flatten(orders.map((order) => order.locationSnapshot)),
      (location) => location.id
    ),
    uniqBy(
      flatten(orders.map((order) => order.venueSnapshot)),
      (venue) => venue.id
    ),
    groupBy(
      orders.map((order) => ({
        ...order,
        locationId: order.venueSnapshot.location,
      })),
      "locationId"
    ),
  ];
}

function groupVenues(orders) {
  return groupBy(
    orders.map((locationOrder) => ({
      ...locationOrder,
      venueId: locationOrder.venueSnapshot.id,
    })),
    "venueId"
  );
}

async function findSalesBreakdown(
  startDate,
  endDate,
  locationIds,
  venueIds,
  organization
) {
  const orders = await findOrders(
    startDate,
    endDate,
    locationIds,
    venueIds,
    organization,
    false
  );
  const [locations, venues, groupedVenuesByLocation] =
    locationsVenuesAndVenuesGroupedByLocation(orders);

  return Promise.all(
    map(groupedVenuesByLocation, async (locationOrders, locationKey) => {
      const groupedVenues = groupVenues(locationOrders);
      const venueRevenuesArray = await Promise.all(
        map(groupedVenues, async (venueOrders, venueKey) => {
          const [totalRevenue, averageDailyRevenue] = await Promise.all([
            calculateTotalRevenue(venueOrders, organization),
            calculateAverageDailyRevenue(venueOrders, organization),
          ]);
          return {
            id: venueKey,
            name: find(venues, (venue) => venue.id === +venueKey).name,
            totalRevenue,
            averageDailyRevenue,
          };
        })
      );
      return {
        id: locationKey,
        name: find(locations, (location) => location.id === +locationKey).name,
        totalRevenue: sum(
          venueRevenuesArray.map((venue) => venue.totalRevenue)
        ),
        averageDailyRevenue: sum(
          venueRevenuesArray.map((venue) => venue.averageDailyRevenue)
        ),
        venues: venueRevenuesArray ?? [],
      };
    })
  );
}

function findItemOrderCount(orders) {
  const allItems = flatten(orders.map((order) => order.itemsSnapshot));
  const uniqItems = uniqBy(allItems, (item) => item.id);
  const itemIds = uniqItems.map((item) => item.id);

  const itemsCountArray = orderBy(
    map(groupBy(allItems, "id"), (sameItems, key) => {
      return {
        id: key,
        name: find(uniqItems, (item) => item.id).name,
        ordersCount: sum(sameItems.map((item) => item.amount ?? 1)),
      };
    }),
    ["ordersCount"],
    ["desc"]
  );

  const numberOfItems = itemIds.length;

  return [itemsCountArray, numberOfItems];
}

async function findOrdersSummary(
  startDate,
  endDate,
  startTime,
  endTime,
  locationIds,
  venueIds,
  organization
) {
  //todo - implement time filter and ratings
  const orders = await findOrders(
    startDate,
    endDate,
    locationIds,
    venueIds,
    organization,
    false
  );
  const foodSatisfaction = random(1.0, 5.0); //placeholder
  const deliverySpeed = random(1.0, 5.0); //placeholder
  const [itemsCountArray, numberOfItems] = findItemOrderCount(orders);

  const bestSellingItems = take(
    itemsCountArray,
    numberOfItems >= 5 ? 5 : numberOfItems
  );

  return {
    foodSatisfaction,
    deliverySpeed,
    bestSellingItems: [
      ...bestSellingItems,
      {
        ordersCount: sum(
          itemsCountArray
            .filter(
              (item) =>
                !bestSellingItems.map((item) => item.id).includes(item.id)
            )
            .map((item) => item.ordersCount)
        ),
      },
    ],
  };
}

async function findOrdersBreakdown(
  startDate,
  endDate,
  startTime,
  endTime,
  locationIds,
  venueIds,
  organization
) {
  //todo - implement time filter and ratings
  const orders = await findOrders(
    startDate,
    endDate,
    locationIds,
    venueIds,
    organization,
    false
  );
  const [locations, venues, groupedVenuesByLocation] =
    locationsVenuesAndVenuesGroupedByLocation(orders);

  return map(groupedVenuesByLocation, (locationOrders, locationKey) => {
    const groupedVenues = groupVenues(locationOrders);
    const venuesBreakdown = map(groupedVenues, (venueOrders, venueKey) => {
      const items = flatten(venueOrders.map((order) => order.itemsSnapshot));
      const [itemsCountArray] = findItemOrderCount(venueOrders);
      const item = maxBy(itemsCountArray, (item) => item.ordersCount);
      return {
        id: venueKey,
        ordersCount: sum(items.map((item) => item.amount ?? 1)),
        name: find(venues, (venue) => venue.id === +venueKey).name,
        foodSatisfaction: random(1.0, 5.0),
        deliverySpeed: random(1.0, 5.0),
        bestSellingItem: item
          ? {
              id: item.id,
              name: item.name,
            }
          : undefined,
      };
    });
    const ordersCount = sum(venuesBreakdown.map((venue) => venue.ordersCount));
    const [itemsCountArray] = findItemOrderCount(locationOrders);
    const bestSellingItem = maxBy(itemsCountArray, (item) => item.ordersCount);
    return {
      id: locationKey,
      name: find(locations, (location) => location.id === +locationKey).name,
      ordersCount,
      bestSellingItem: bestSellingItem
        ? {
            id: bestSellingItem.id,
            name: bestSellingItem.name,
          }
        : undefined,
      foodSatisfaction: random(1.0, 5.0),
      deliverySpeed: random(1.0, 5.0),
      venues: venuesBreakdown,
    };
  });
}

module.exports = {
  findOrders,
  findItemsSoldPerCategory,
  calculateTotalRevenue,
  calculateTotalNumberOfItemsSold,
  calculateAverageDailyRevenue,
  findSalesBreakdown,
  findOrdersSummary,
  findOrdersBreakdown,
};
