"use strict";

/**
 * `parser` service.
 */

const { sanitizeEntity: strapiSanitizeEntity } = require("strapi-utils");
const { get, sumBy, union } = require("lodash");

function parseLabelRequest(object, key) {
  if (object) {
    const keyLocalized = `${key}Localized`;
    const keyDisplay = `${key}Display`;

    if (!object[keyLocalized]) {
      object[keyLocalized] = object[key];
    }
    if (object[keyLocalized]) {
      delete object[key];
      const localized = object[keyLocalized];
      object[keyDisplay] = get(
        localized,
        "en",
        get(Object.entries(localized || {}), "[0][1]")
      );
    }
  }
}

function parseOrderedRequest(object, key, keyOrdered = `${key}Order`) {
  if (object[key]?.length) {
    object[keyOrdered] = object[key].map(mapRelationId);
  }
}

function parseLabelResponse(object, key) {
  if (object) {
    const keyLocalized = `${key}Localized`;
    object[key] = object[keyLocalized];
  }
}

function sanitizeEntity(entity, options) {
  const sanitized = strapiSanitizeEntity(entity, options);

  sanitized.createdAt = sanitized.createdAt || sanitized.created_at;
  delete sanitized.created_at;

  sanitized.updatedAt = sanitized.updatedAt || sanitized.updated_at;
  delete sanitized.updated_at;

  sanitized.publishedAt = sanitized.publishedAt || sanitized.published_at;
  delete sanitized.published_at;

  return sanitized;
}

function mapLanguageResponse(language) {
  if (language && language.iso) {
    return sanitizeEntity(language, { model: strapi.models.language }).iso;
  }
}

function mapCurrencyResponse(currency) {
  if (currency && currency.iso) {
    return sanitizeEntity(currency, { model: strapi.models.currency }).iso;
  }
}

function mapLabelResponse(label) {
  const response = label.reduce(
    (obj, item) =>
      Object.assign(obj, { [mapLanguageResponse(item.language)]: item.value }),
    {}
  );
  delete response.undefined;
  return response;
}

function mapLabelRequest(request) {
  return Object.entries(request).map((it) => {
    const iso = it[0];
    const value = it[1];
    const language = strapi.localization.languages.find(
      (lang) => lang.iso === iso
    );
    return {
      language,
      value,
    };
  });
}

function mapCarouselResponse(carousel) {
  return carousel.map((it) => ({
    ...it,
    title: mapLabelResponse(it.title),
    subtitle: mapLabelResponse(it.subtitle),
  }));
}

function mapCarouselRequest(request) {
  if (request.title) {
    request.title = mapLabelRequest(request.title);
  }
  if (request.subtitle) {
    request.subtitle = mapLabelRequest(request.subtitle);
  }
  return request;
}

function mapOrganizationResponse(organization) {
  const entity = sanitizeEntity(organization, {
    model: strapi.models.organization,
  });
  if (entity.carousel && entity.carousel.length) {
    entity.carousel = mapCarouselResponse(entity.carousel);
  }
  if (get(organization, "languages[0].iso")) {
    entity.languages = organization.languages.map(mapLanguageResponse);
  }
  if (get(organization, "currency.iso")) {
    entity.currency = mapCurrencyResponse(organization.currency);
  }
  if (get(organization, "initialOrderStatus.id")) {
    entity.initialOrderStatus = mapOrderStatusResponse(
      organization.initialOrderStatus
    );
  }
  if (get(organization, "orderStatuses[0].id")) {
    entity.orderStatuses = organization.orderStatuses.map(
      mapOrderStatusResponse
    );
  }
  if (get(organization, "orderTypes[0].id")) {
    entity.orderTypes = organization.orderTypes.map(mapOrderTypeResponse);
  }
  if (entity.message) {
    entity.message = mapLabelResponse(entity.message);
  }
  delete entity.tables;
  delete entity.venues;
  delete entity.locations;
  delete entity.users;
  delete entity.category;

  return entity;
}

function mapOrganizationRequest(request) {
  if (request.carousel && request.carousel.length) {
    request.carousel = request.carousel.map((it) => mapCarouselRequest(it));
  }
  if (request.message) {
    request.message = mapLabelRequest(request.message);
  }
  return request;
}

function mapMenuResponse(menu) {
  const entity = sanitizeEntity(menu, { model: strapi.models.menu });
  const categories = get(entity, "categories", []);
  let venues;
  let locations;
  if (entity.venues) {
    venues = entity.venues.map((it) => it.id);
    locations = entity.venues
      .map((it) => get(it, "location.id"))
      .filter((it) => !!it);
  }
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    description: mapLabelResponse(entity.description),
    categories: orderIdsBy(
      categories.map((it) => it.id),
      get(menu, "categoriesOrder", [])
    ),
    itemCount: sumBy(categories, (it) => get(it, "items", []).length),
    venues,
    locations,
  };
}

function mapMenuRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.description) {
    params.description = mapLabelRequest(params.description);
  }
  if (params.categories) {
    params.categoriesOrder = params.categories;
  }
  return params;
}

function mapCategoryResponse(category) {
  const entity = sanitizeEntity(category, { model: strapi.models.category });
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    description: mapLabelResponse(entity.description),
    menus: get(entity, "menus", []).map((it) => it.id),
    items: orderIdsBy(
      get(category, "items", []).map((it) => it.id),
      get(category, "itemsOrder", [])
    ),
  };
}

function mapAppCategoryResponse(category) {
  const entity = sanitizeEntity(category, { model: strapi.models.category });
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    description: mapLabelResponse(entity.description),
    menus: get(entity, "menus", []).map((it) => it.id),
    items: orderIdsBy(
      get(category, "items", []).map(mapItemResponse2),
      get(category, "itemsOrder", [])
    ),
  };
}

function mapCategoryRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.description) {
    params.description = mapLabelRequest(params.description);
  }
  if (params.items) {
    params.itemsOrder = params.items;
  }
  return params;
}

function mapAllergenResponse(allergen) {
  const entity = sanitizeEntity(allergen, { model: strapi.models.allergen });
  return {
    ...entity,
    name: mapLabelResponse(allergen.name),
  };
}

function mapItemOptionRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.description) {
    params.description = mapLabelRequest(params.description);
  }
  return params;
}

function mapItemOptionResponse(option) {
  const entity = sanitizeEntity(option, {
    model: strapi.models["item-option"],
  });
  return {
    ...entity,
    name: option.nameLocalized ?? mapLabelResponse(option.name ?? []),
    description: option.descriptionLocalized,
  };
}

function mapItemGroupRequest(params) {}

function mapItemOptionGroupResponse(optionGroup, options) {
  return {
    ...optionGroup,
    name: mapLabelResponse(optionGroup.name),
    description: mapLabelResponse(optionGroup.description),
    options: options
      ? optionGroup.options.map((it) =>
          mapItemOptionResponse(options.find((option) => option.id === it.id))
        )
      : [],
  };
}

function mapItemOptionGroupRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.description) {
    params.description = mapLabelRequest(params.description);
  }
  params.options = get(params.options, "options", []).map((it) =>
    mapItemOptionRequest(it)
  );

  return params;
}

function mapItemGroupResponse(optionGroup) {
  const entity = sanitizeEntity(optionGroup, {
    model: strapi.models["item-group"],
  });
  return {
    ...entity,
    name: optionGroup.nameLocalized,
    description: optionGroup.descriptionLocalized,
    options: orderByIds(
      get(entity, "options", []).map(mapItemOptionResponse),
      get(optionGroup, "optionsOrder", [])
    ),
  };
}

function mapItemRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.description) {
    params.description = mapLabelRequest(params.description);
  }
  if (params.longDescription) {
    params.longDescription = mapLabelRequest(params.longDescription);
  }
  if (params.optionGroups && params.optionGroups.length) {
    params.optionGroups = params.optionGroups.map((it) =>
      mapItemOptionGroupRequest(it)
    );
    params.optionGroupsOrder = params.optionGroups.map(mapRelationId);
  }
  return params;
}

function mapItemResponse(item, sanitize = true) {
  const entity = sanitize
    ? sanitizeEntity(item, { model: strapi.models.item })
    : item;
  const optionGroups = get(item, "optionGroups", []).map((og) =>
    mapItemGroupResponse(og)
  );
  const optionGroupsOrder = get(item, "optionGroupsOrder", []);
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    description: mapLabelResponse(entity.description),
    longDescription: mapLabelResponse(entity.longDescription),
    allergens: entity.allergens.map((it) => it.id),
    optionGroups: mapOptionGroupsOrder(optionGroups, optionGroupsOrder),
    categories: entity.categories.map((it) => it.id),
    tags: entity.tags.map((it) => it.id),
  };
}

function mapItemResponse2(item) {
  const entity = sanitizeEntity(item, { model: strapi.models.item });
  return {
    ...entity,
    name: entity.nameLocalized ?? mapLabelResponse(entity.name ?? []),
    description:
      entity.descriptionLocalized ?? mapLabelResponse(entity.description ?? []),
    longDescription:
      entity.longDescriptionLocalized ??
      mapLabelResponse(entity.longDescription ?? []),
    optionGroups: orderByIds(
      get(item, "optionGroups", []).map(mapItemGroupResponse),
      get(item, "optionGroupsOrder", [])
    ),
    categories: entity.categories?.map(mapRelationId) ?? [],
    tags: entity.tags?.map(mapRelationId) ?? [],
  };
}

function mapOptionGroupsOrder(originalGroups, orderedIds) {
  const ids = orderIdsBy(originalGroups.map(mapRelationId), orderedIds);
  return ids.map((it) => originalGroups.find((group) => group.id === it));
}

function mapVenueRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  if (params.menus) {
    params.menusOrder = params.menus;
  }
  return params;
}

function mapVenueResponse(venue) {
  const entity = sanitizeEntity(venue, { model: strapi.models.venue });
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    location: get(entity, "location.id"),
    tables: venue.tables.map((it) => mapTableResponse(it)),
    menus: orderIdsBy(
      venue.menus.map((it) => it.id),
      get(venue, "menusOrder", [])
    ),
  };
}

function orderIdsBy(originalIds = [], orderedIds = []) {
  return union(orderedIds, originalIds).filter((it) =>
    originalIds.includes(it)
  );
}

function orderByIds(original, orderedIds) {
  const originalIds = original?.map(mapRelationId) ?? [];
  return union(orderedIds, originalIds)
    .map((it) => original?.find((oi) => oi === it || oi?.id === it))
    .filter((it) => !!it);
}

function mapLocationRequest(params) {
  if (params.name) {
    params.name = mapLabelRequest(params.name);
  }
  return params;
}

function mapLocationResponse(location) {
  const entity = sanitizeEntity(location, { model: strapi.models.location });
  return {
    ...entity,
    name: mapLabelResponse(entity.name),
    venues: location.venues.map((it) => it.id),
  };
}

function mapTableRequest(params) {
  return params;
}

function mapTableResponse(table) {
  const entity = sanitizeEntity(table, { model: strapi.models.table });
  return {
    ...entity,
    venue: get(entity, "venue.id"),
  };
}

function mapInstallationResponse(installation) {
  const entity = sanitizeEntity(installation, {
    model: strapi.models.installation,
  });
  delete entity.user;
  delete entity.uuid;
  return entity;
}

function mapOrderTypeResponse(orderType) {
  const entity = sanitizeEntity(orderType, {
    model: strapi.models["order-type"],
  });
  entity.name = mapLabelResponse(entity.name);
  return entity;
}

function mapOrderStatusResponse(orderStatus) {
  const entity = sanitizeEntity(orderStatus, {
    model: strapi.models["order-status"],
  });
  entity.name = mapLabelResponse(entity.name);
  return entity;
}

function mapRelationId(relation) {
  if (!isNaN(relation)) {
    return relation;
  }
  if (relation && relation.id) {
    return relation.id;
  }
  return null;
}

function mapOrderResponse(order) {
  const entity = sanitizeEntity(order, { model: strapi.models.order });
  entity.type = mapRelationId(get(entity, "type"));
  entity.location = mapRelationId(get(entity, "location"));
  entity.venue = mapRelationId(get(entity, "venue"));
  entity.table = mapRelationId(get(entity, "table"));
  entity.status = mapRelationId(get(entity, "status"));
  entity.installation = mapRelationId(get(entity, "installation"));
  if (entity.items) {
    entity.items = entity.items.map(mapRelationId);
  }
  entity.itemsSnapshot = entity.itemsSnapshot || [];
  if (entity.categories) {
    entity.categories = entity.categories.map(mapRelationId);
  }
  entity.categoriesSnapshot = entity.categoriesSnapshot || [];
  entity.organization = mapRelationId(get(entity, "organization"));
  entity.currency = mapRelationId(get(entity, "currency"));
  if (entity.payments?.length) {
    entity.payments = entity.payments.map(mapPaymentResponse);
  }
  return entity;
}

function mapOrderRequest(params, data) {
  const table = sanitizeEntity(data.table, { model: strapi.models.table });
  delete table.venue;

  const installation = sanitizeEntity(data.installation, {
    model: strapi.models.installation,
  });
  delete installation.uuid;
  delete installation.user;

  const currency = mapCurrencyResponse(data.currency);

  const categories = data.categories.map((it) => {
    const category = sanitizeEntity(it, { model: strapi.models.category });
    delete category.organization;
    category.name = mapLabelResponse(category.name);
    category.description = mapLabelResponse(category.description);
    return category;
  });

  const items = params.items.map((item) => {
    const fullItem = sanitizeEntity(
      data.items.find((it) => it.id === item.id),
      { model: strapi.models.item }
    );

    const optionGroups = item.optionGroups
      .map((optionGroup) => {
        const fullOptionGroup = fullItem.optionGroups.find(
          (it) => it.id === optionGroup.id
        );

        const options = optionGroup.options
          .map((option) => {
            let fullOption = data.itemOptions.find((it) => option.id === it.id);
            if (fullOption) {
              fullOption = sanitizeEntity(fullOption, {
                model: strapi.models["item-option"],
              });
              fullOption.name = mapLabelResponse(fullOption.name);
            }
            return fullOption;
          })
          .filter((it) => !!it);

        fullOptionGroup.name = mapLabelResponse(fullOptionGroup.name);
        fullOptionGroup.description = mapLabelResponse(
          fullOptionGroup.description
        );

        return {
          ...fullOptionGroup,
          options,
        };
      })
      .filter((it) => get(it, "options", []).length);

    delete fullItem.categories;

    fullItem.name = mapLabelResponse(fullItem.name);
    fullItem.description = mapLabelResponse(fullItem.description);

    return {
      ...fullItem,
      optionGroups,
    };
  });

  const venue = sanitizeEntity(data.venue, { model: strapi.models.venue });
  venue.name = mapLabelResponse(venue.name);

  const location = sanitizeEntity(data.location, {
    model: strapi.models.location,
  });
  location.name = mapLabelResponse(location.name);

  data.type = mapRelationId(data.type);
  data.table = mapRelationId(data.table);
  data.user = mapRelationId(data.user);
  data.organization = mapRelationId(data.organization);
  data.items = data.items.map(mapRelationId);
  data.location = mapRelationId(data.location);
  data.venue = mapRelationId(data.venue);
  data.currency = mapRelationId(data.currency);
  data.status = mapRelationId(data.status);
  data.installation = mapRelationId(data.installation);
  data.categories = data.categories.map(mapRelationId);

  data.itemsSnapshot = items;
  data.locationSnapshot = location;
  data.tableSnapshot = table;
  data.venueSnapshot = venue;
  data.currencySnapshot = currency;
  data.installationSnapshot = installation;
  data.categoriesSnapshot = categories;

  delete data.itemOptions;

  return data;
}

function mapFeedbackSystemResponse(feedback) {
  return sanitizeEntity(feedback, { model: strapi.models["feedback-system"] });
}

function mapFeedbackOrganizationResponse(feedback) {
  return sanitizeEntity(feedback, {
    model: strapi.models["feedback-organization"],
  });
}

function mapStaffResponse(user) {
  return {
    id: user.id,
    email: user.email,
  };
}

function mapUserResponse(user) {
  return sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });
}

function mapTagRequest(tag) {
  if (tag.name) {
    tag.name = mapLabelRequest(tag.name);
  }
  return tag;
}

function mapTagResponse(tag) {
  const entity = sanitizeEntity(tag, { model: strapi.models.tag });
  entity.name = mapLabelResponse(entity.name);
  return entity;
}

function mapPrinterRequest(printer) {
  const language = printer.language;
  if (language) {
    printer.language = strapi.localization.languages.find(
      (lang) => lang.iso === language
    );
  }
  return printer;
}

function mapPrinterResponse(printer) {
  const entity = sanitizeEntity(printer, { model: strapi.models.printers });
  entity.triggerLocations = entity.triggerLocations?.map(mapRelationId);
  entity.triggerVenues = entity.triggerVenues?.map(mapRelationId);
  entity.triggerTables = entity.triggerTables?.map(mapRelationId);
  entity.triggerOrderStatuses = entity.triggerOrderStatuses?.map(mapRelationId);
  entity.language = mapLanguageResponse(entity.language) ?? null;
  return entity;
}

function mapUserAddressResponse(userAddress) {
  return sanitizeEntity(userAddress, {
    model: strapi.models["user-address"],
  });
}

function mapPaymentResponse(payment) {
  return sanitizeEntity(payment, {
    model: strapi.models.payment,
  });
}

module.exports = {
  parseOrderedRequest,
  parseLabelRequest,
  parseLabelResponse,

  mapLanguageResponse,
  mapCurrencyResponse,
  mapAllergenResponse,

  mapLabelResponse,
  mapLabelRequest,

  mapCarouselResponse,
  mapCarouselRequest,

  mapOrganizationResponse,
  mapOrganizationRequest,

  mapMenuResponse,
  mapMenuRequest,

  mapCategoryResponse,
  mapCategoryRequest,

  mapItemRequest,
  mapItemResponse,
  mapItemResponse2,

  mapItemGroupRequest,
  mapItemGroupResponse,

  mapItemOptionRequest,
  mapItemOptionResponse,

  mapVenueRequest,
  mapVenueResponse,

  mapLocationRequest,
  mapLocationResponse,

  mapTableRequest,
  mapTableResponse,

  mapInstallationResponse,
  mapOrderTypeResponse,
  mapOrderResponse,
  mapOrderRequest,

  mapRelationId,
  sanitizeEntity,

  mapFeedbackSystemResponse,
  mapFeedbackOrganizationResponse,

  mapStaffResponse,
  mapUserResponse,

  orderIdsBy,

  mapTagRequest,
  mapTagResponse,

  mapPrinterRequest,
  mapPrinterResponse,

  mapOrderStatusResponse,
  orderByIds,

  mapAppCategoryResponse,
  mapUserAddressResponse,

  mapPaymentResponse,
};
