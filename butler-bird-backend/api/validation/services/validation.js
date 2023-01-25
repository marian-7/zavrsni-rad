"use strict";

/**
 * `validation` service.
 */
const { isPlainObject, toNumber } = require("lodash");
const yup = require("yup");

const regexTime = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

async function validateRequest(ctx, schema, params, options) {
  return schema
    .validate(params, options)
    .then((it) => it)
    .catch((err) => ctx.throw(400, err));
}

const idSchema = yup.lazy((obj) => {
  if (isPlainObject(obj)) {
    return yup
      .object({ id: yup.number() })
      .transform((obj) => toNumber(obj.id));
  }
  return yup.number().nullable();
});

const idRequiredSchema = yup.lazy((obj) => {
  if (isPlainObject(obj)) {
    return yup
      .object({ id: yup.number().required() })
      .required()
      .transform((obj) => toNumber(obj.id));
  }
  return yup.number().required();
});

const labelSchema = yup
  .mixed()
  .transform((obj) => strapi.services.parser.mapLabelRequest(obj));

const labelShapeBuilder = () =>
  strapi.localization?.languages?.reduce(
    (obj, item) => Object.assign(obj, { [item.iso]: yup.string() }),
    {}
  );

const label2Schema = yup.lazy(() =>
  yup.object().shape(labelShapeBuilder()).nullable().noUnknown()
);
const label2RequiredSchema = yup.lazy(() =>
  yup.object().shape(labelShapeBuilder()).required().noUnknown()
);

const boolNullSchema = yup.mixed().transform((obj) => obj === true);

const userRequestSchema = yup.object().shape({
  id: yup.number().required(),
});

const passwordSchema = yup
  .string()
  .test("is-password", `password isn't valid`, (value, context) => {
    return !strapi.plugins["users-permissions"].services.user.isHashed(value);
  });

const installationRequestCreateSchema = yup
  .object()
  .shape({
    pushToken: yup.string().required(),
    userAgent: yup.string().default("unknown"),
    user: idSchema,
    email: yup.string().email(),
  })
  .noUnknown();

const installationRequestFindSchema = yup
  .object()
  .shape({
    pushToken: yup.string().required(),
  })
  .noUnknown();

const installationRequestDeleteSchema = yup.object().shape({
  pushToken: yup.string().required(),
});

const installationRequestCreateV2Schema = yup
  .object()
  .shape({
    userAgent: yup.string().default("unknown"),
    user: idSchema,
    email: yup.string().email(),
  })
  .noUnknown();

const installationRequestUpdateV2Schema = yup
  .object()
  .shape({
    uid: yup.string().required(),
    userAgent: yup.string().default("unknown"),
    user: idSchema,
    email: yup.string().email(),
  })
  .from("pushToken", "uid")
  .from("installation", "uid")
  .noUnknown();

const installationRequestFindV2Schema = yup
  .object()
  .shape({
    uid: yup.string().required(),
  })
  .from("pushToken", "uid")
  .from("installation", "uid")
  .noUnknown();

const tableCreateBulkRequestSchema = yup
  .object({
    organization: yup.number().required(),
    labelTemplate: yup.string().required(),
    labelStartAt: yup.number().default(1),
    venue: yup.number().notRequired(),
    amount: yup.number().required(),
  })
  .noUnknown(true);

const appFindTableRequestSchema = yup
  .object({
    id: yup.number().required(),
  })
  .noUnknown();

const appFindCategoriesRequestSchema = yup
  .object({
    menuId: yup.number().required(),
  })
  .noUnknown();

const itemModifier = yup.object({
  id: yup.number(),
  name: labelSchema.required(),
  description: labelSchema,
  price: yup.number(),
});

const itemModifierGroupRequestSchema = yup
  .object({
    id: idSchema,
    selectionMode: yup.string().oneOf(["single", "multiple"]),
    name: labelSchema.required(),
    description: labelSchema,
    options: yup.array(itemModifier),
    required: boolNullSchema,
    accessLevel: yup.string().oneOf(["organization", "item"]),
  })
  .noUnknown();

const itemRequestSchema = yup
  .object({
    id: yup.number(),
    organization: idRequiredSchema,
    name: labelSchema.required(),
    description: labelSchema,
    longDescription: labelSchema,
    allergens: yup.array().of(idRequiredSchema),
    categories: yup.array(idSchema),
    image: yup.mixed(),
    optionGroups: yup.array(itemModifierGroupRequestSchema),
    price: yup.number(),
  })
  .noUnknown();

const orderFindSchema = yup.object({
  id: yup.number(),
  organization: idRequiredSchema,
});

const orderCreateItemSchema = yup.object({
  optionGroups: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        options: yup
          .array()
          .of(
            yup.object({
              id: yup.number().required(),
              amount: yup.number(),
            })
          )
          .default([]),
      })
    )
    .default([]),
  amount: yup.number(),
});

const orderCreateRequestSchema = yup
  .object({
    table: idRequiredSchema,
    user: idSchema,
    installation: yup.mixed().required(),
    items: yup.array().of(orderCreateItemSchema).required(),
    note: yup.string(),
    userAddress: idSchema,
  })
  .noUnknown();

const orderCreateCustomRequestSchema = yup
  .object({
    table: idRequiredSchema,
    user: idSchema,
    installation: yup.mixed().required(),
    type: idRequiredSchema,
    note: yup.string(),
  })
  .noUnknown();

const relationSchema = yup.object({
  id: yup.number().required(),
});

const orderCreateDataSchema = yup.object({
  table: relationSchema.required(),
  venue: relationSchema.required(),
  location: relationSchema.required(),
  organization: idRequiredSchema,
  installation: yup.mixed().required(),
  currency: relationSchema.required(),
  status: idRequiredSchema,
  items: yup.array().of(relationSchema.required()).required(),
  itemOptions: yup.array().of(relationSchema),
  categories: yup.array().of(relationSchema.required()).required(),
  note: yup.string(),
});

const orderCreateCustomDataSchema = yup.object({
  type: idRequiredSchema,
  table: relationSchema.required(),
  venue: relationSchema.required(),
  location: relationSchema.required(),
  organization: idRequiredSchema,
  installation: yup.mixed().required(),
  currency: relationSchema.required(),
  status: idRequiredSchema,
  note: yup.string(),
});

const orderUpdateStatusSchema = yup
  .object({
    id: idRequiredSchema,
    status: idRequiredSchema,
    organization: idRequiredSchema,
  })
  .noUnknown();

const orderHistoryFindSchema = yup.object({
  installation: yup.mixed().required(),
  user: idSchema,
});

const orderHistoryFindOneSchema = yup.object({
  order: idRequiredSchema,
  installation: yup.mixed().required(),
  user: idSchema,
});

const analyticsSalesRequestSchema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  locations: yup.array().of(idRequiredSchema),
  venues: yup.array().of(idRequiredSchema),
  organization: idRequiredSchema,
});

const analyticsOrdersRequestSchema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  startTime: yup.string().matches(regexTime).default("00:00"),
  endTime: yup.string().matches(regexTime).default("23:59"),
  locations: yup.array().of(idRequiredSchema),
  venues: yup.array().of(idRequiredSchema),
  organization: idRequiredSchema,
});

const socketConnectionQuerySchema = yup.object({
  locations: yup.array().of(idRequiredSchema).default([]),
  venues: yup.array().of(idRequiredSchema).default([]),
  tables: yup.array().of(idRequiredSchema).default([]),
  organization: idRequiredSchema,
});

const feedbackSystemCreateSchema = yup
  .object({
    firstUsage: yup.boolean().required(),
    rating: yup.number().min(1).max(5).required(),
    preferredInteraction: yup.boolean().required(),
    note: yup.string(),
    installation: yup.mixed().required(),
    user: idSchema,
  })
  .noUnknown();

const feedbackOrganizationCreateSchema = yup
  .object({
    foodRating: yup.number().min(1).max(5).required(),
    speedRating: yup.number().min(1).max(5).required(),
    note: yup.string(),
    installation: yup.mixed().required(),
    user: idSchema,
    organization: idRequiredSchema,
  })
  .noUnknown();

const feedbackOrganizationFindSchema = yup
  .object({
    user: idSchema,
    installation: yup.mixed().required(),
    organization: yup.string().required(),
  })
  .noUnknown();

const staffAddSchema = yup
  .object({
    email: yup.string().email().required(),
    organization: idRequiredSchema,
  })
  .noUnknown();

const staffRemoveSchema = yup
  .object({
    email: yup.string().email().required(),
    organization: idRequiredSchema,
  })
  .noUnknown();

const staffFindSchema = yup
  .object({
    organization: idRequiredSchema,
  })
  .noUnknown();

const invitationAcceptSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  uid: yup.string().required(),
  email: yup.string().email().required(),
  password: passwordSchema.required(),
});

const qrGeneratorSchema = yup.object({
  organization: yup.number().required(),
  locale: yup.string().required(),
});

// todo: expand
const venueRequestSchema = yup.object({
  location: idSchema,
  menus: yup.array(idSchema),
});

const menuRequestSchema = yup.object({
  categories: yup.array(idSchema),
});

const categoryRequestSchema = yup.object({
  items: yup.array(idSchema),
});

const tagRequestSchema = yup
  .object({
    name: labelSchema.required(),
    item: idSchema,
    organization: idRequiredSchema,
    accessLevel: yup.string().oneOf(["organization", "item"]),
  })
  .noUnknown();

const tagFindSchema = yup.object({
  organization: idRequiredSchema,
  item: idSchema,
});

const tagFindAppSchema = yup.object({
  organization: idRequiredSchema,
});

const itemTagsRequestSchema = yup
  .object({
    item: idRequiredSchema,
    organization: idRequiredSchema,
    tags: yup.array(idSchema),
  })
  .noUnknown();

const orderCancelSchema = yup
  .object({
    organization: idRequiredSchema,
    order: idRequiredSchema,
    canceledReason: yup.string().required(),
  })
  .noUnknown();

const printerRequestCreateSchema = yup
  .object({
    organization: idRequiredSchema,
    serialNumber: yup.string().required(),
    name: yup.string(),
    triggerVenues: yup.array(idSchema),
    triggerTables: yup.array(idSchema),
    triggerLocations: yup.array(idSchema),
    triggerOrderStatuses: yup.array(idSchema),
    triggerIncludeCanceledOrders: yup.boolean(),
    language: yup.string().required(),
  })
  .noUnknown();

const printerRequestUpdateSchema = yup
  .object({
    organization: idRequiredSchema,
    serialNumber: yup.string(),
    name: yup.string(),
    triggerVenues: yup.array(idSchema),
    triggerTables: yup.array(idSchema),
    triggerLocations: yup.array(idSchema),
    triggerOrderStatuses: yup.array(idSchema),
    triggerIncludeCanceledOrders: yup.boolean(),
    language: yup.string(),
  })
  .noUnknown();

const profileDeleteSchema = yup.object({
  user: idRequiredSchema,
});

const pinSchema = yup
  .object({
    latitude: yup.number().required(),
    longitude: yup.number().required(),
  })
  .noUnknown();

module.exports = {
  appFindTableRequestSchema,
  appFindCategoriesRequestSchema,

  userRequestSchema,
  installationRequestCreateSchema,
  installationRequestDeleteSchema,
  installationRequestFindSchema,
  installationRequestCreateV2Schema,
  installationRequestFindV2Schema,
  installationRequestUpdateV2Schema,
  tableCreateBulkRequestSchema,

  idSchema,
  idRequiredSchema,
  label2Schema,
  label2RequiredSchema,

  itemRequestSchema,
  itemModifierGroupRequestSchema,

  orderFindSchema,
  validateRequest,

  orderCreateRequestSchema,
  orderCreateCustomRequestSchema,

  orderCreateDataSchema,
  orderCreateCustomDataSchema,
  orderUpdateStatusSchema,
  orderHistoryFindSchema,

  analyticsSalesRequestSchema,
  analyticsOrdersRequestSchema,

  socketConnectionQuerySchema,

  feedbackSystemCreateSchema,
  feedbackOrganizationCreateSchema,
  feedbackOrganizationFindSchema,

  staffAddSchema,
  staffRemoveSchema,
  staffFindSchema,

  invitationAcceptSchema,

  qrGeneratorSchema,
  venueRequestSchema,
  menuRequestSchema,
  categoryRequestSchema,

  tagRequestSchema,
  tagFindSchema,
  itemTagsRequestSchema,
  tagFindAppSchema,

  orderCancelSchema,

  printerRequestCreateSchema,
  printerRequestUpdateSchema,
  profileDeleteSchema,

  labelShapeBuilder,
  pinSchema,
};
