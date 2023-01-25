'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
async function findByItemAndOrganization(itemId, organizationId) {
  return strapi.query('tag').model.query(qb => {
    qb.where(`tags.accessLevel`, 'global');
    qb.orWhereRaw(`"tags"."accessLevel" = ? AND "tags"."organization" = ?`, ['organization', organizationId]);
    if (itemId) {
      qb.leftJoin('items__tags', 'tags.id', 'items__tags.tag_id');
      qb.orWhereRaw(`"items__tags"."item_id" = ? AND "tags"."accessLevel" = ?`, [itemId, 'item']);
    }
  }).fetchAll();
}

module.exports = {
  findByItemAndOrganization,
};
