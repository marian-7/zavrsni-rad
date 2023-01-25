"use strict";

const { parseMultipartData } = require("strapi-utils");
const { get } = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.item.search(ctx.query);
    entities = entities.map((entity) =>
      services.parser.mapItemResponse(entity)
    );
  } else {
    entities = await services.item.findItems(ctx.query);
  }
  return ctx.send(entities);
}

async function findOne(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services.item.findOneItem({ id, organization });
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(entity);
}

async function remove(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services.item.delete({ id, organization });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemResponse(entity));
}

async function create(ctx) {
  const { services } = strapi;
  const { validateRequest, itemRequestSchema } = services.validation;
  const organization = get(
    ctx,
    "request.header.organization",
    get(ctx, "request.body.organization")
  );
  let request = ctx.request.body;
  let multipart;
  if (ctx.is("multipart")) {
    multipart = parseMultipartData(ctx);
    request = multipart.data;
  }
  request.organization = organization;
  let entity;

  let params = await validateRequest(ctx, itemRequestSchema, request);
  await strapi.connections.default.transaction(async (transacting) => {
    const groupOptionService = strapi.services["item-group"];
    params.optionGroups = await groupOptionService.createOrUpdateOptionGroups(
      params.organization,
      params.optionGroups || [],
      { transacting }
    );
    if (multipart) {
      entity = await services.item.create(
        {
          ...request,
          ...params,
        },
        { files: multipart.files, transacting }
      );
    } else {
      entity = await services.item.create(params, { transacting });
    }
    entity = await services.item.findOneItem(
      { id: entity.id, organization },
      null,
      { transacting }
    );
  });

  return ctx.send(entity);
}

async function update(ctx) {
  const { services } = strapi;
  const { validateRequest, itemRequestSchema } = services.validation;
  const { id } = ctx.params;
  const { organization } = ctx.request.header;
  let request = ctx.request.body;
  let multipart;
  if (ctx.is("multipart")) {
    multipart = parseMultipartData(ctx);
    request = multipart.data;
  }
  request.organization = organization;
  let params = await validateRequest(ctx, itemRequestSchema, request);
  let entity;
  await strapi.connections.default.transaction(async (transacting) => {
    const groupOptionService = strapi.services["item-group"];
    params.optionGroups = await groupOptionService.createOrUpdateOptionGroups(
      organization,
      params.optionGroups
    );
    params.optionGroups = params.optionGroups
    .map((og) => og.id);
    if (multipart) {
      entity = await services.item.update({ id }, params, {
        files: multipart.files,
        transacting,
      });
    } else {
      entity = await services.item.update({ id }, params, { transacting });
    }

    entity = await services.item.findOneItem({ id, organization }, null, {
      transacting,
    });
  });
  return ctx.send(entity);
}

async function createOrUpdateOptionGroups(organization, groups, params) {
  if (groups) {
    return Promise.all(
      groups.map((group) =>
        createOrUpdateOptions(organization, group.options, params).then(
          (options) => {
            group.options = options;
            return group;
          }
        )
      )
    );
  }
  return groups;
}

async function createOrUpdateOptions(organization, options, params) {
  const service = strapi.services["item-option"];
  return Promise.all(
    options.map((option) =>
      option.id
        ? service.update({ id: option.id }, option, params)
        : service.create({ ...option, organization }, params)
    )
  );
}

async function updateTags(ctx) {
  const { services } = strapi;
  const { validateRequest, itemTagsRequestSchema } = services.validation;
  const { item, organization, tags } = await validateRequest(
    ctx,
    itemTagsRequestSchema,
      {
      ...ctx.params,
      ...ctx.request.header,
      ...ctx.request.body,
    }
  );

  await services.item.setTags(organization, item, tags);
  const entity = await services.item.findOneItem({
    id: item,
    organization,
  });

  return ctx.send(entity);
}

/*
  V2 methods
 */
async function find2(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.item.search(ctx.query);
  } else {
    entities = await services.item.find(ctx.query);
  }
  return ctx.send(
    entities.map(
      (entity) => services.parser.mapItemResponse2(entity),
      ["image", "optionGroups", "optionGroups.options", "tags"]
    )
  );
}

async function findOne2(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services.item.findOne({ id, organization }, [
    "image",
    "optionGroups",
    "optionGroups.options",
    "tags",
  ]);

  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemResponse2(entity));
}

async function create2(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  let params = { ...ctx.request.body, organization };
  let multipart;
  if (ctx.is("multipart")) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  services.parser.parseLabelRequest(params, "name");
  services.parser.parseLabelRequest(params, "description");
  services.parser.parseLabelRequest(params, "longDescription");
  services.parser.parseOrderedRequest(params, "optionGroups");

  let entity;
  try {
    if (multipart) {
      entity = await services.item.create(params, { files: multipart.files });
    } else {
      entity = await services.item.create(params);
    }
    entity = await services.item.findOne({ id: entity.id, organization }, [
      "image",
      "optionGroups",
      "optionGroups.options",
      "tags",
    ]);
  } catch (e) {
    return ctx.throw(e);
  }

  return ctx.send(services.parser.mapItemResponse2(entity));
}

async function update2(ctx) {
  const { services } = strapi;
  const { id } = ctx.params;
  const { organization } = ctx.request.header;
  let params = ctx.request.body;
  let multipart;
  if (ctx.is("multipart")) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  services.parser.parseLabelRequest(params, "name");
  services.parser.parseLabelRequest(params, "description");
  services.parser.parseLabelRequest(params, "longDescription");
  services.parser.parseOrderedRequest(params, "optionGroups");

  let entity;
  try {
    if (multipart) {
      entity = await services.item.update({ id, organization }, params, {
        files: multipart.files,
      });
    } else {
      entity = await services.item.update({ id, organization }, params);
    }
    entity = await services.item.findOne({ id, organization }, [
      "image",
      "optionGroups",
      "optionGroups.options",
      "tags",
    ]);
  } catch (e) {
    return ctx.throw(e);
  }

  return ctx.send(services.parser.mapItemResponse2(entity));
}

async function remove2(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services.item.delete({ id, organization });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemResponse2(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
  updateTags,

  find2,
  findOne2,
  create2,
  update2,
  delete2: remove2,
};
