'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async findAll (ctx) {

        let { page, page_size, lang } = ctx.query;
        let _start = (Number(page) -1) * Number(page_size);
        let query = {
            'language.slug': lang,
            _start,
            _limit: page_size
        }
        let [count, promotions] = await Promise.all([
            await strapi.services.promotion.count(query),
            await strapi.services.promotion.find(query)
        ])

        let data = promotions.map(entity => sanitizeEntity(entity, { model: strapi.models.promotion }));
        let pagination = {
            total: Math.ceil( Number(count) / Number(page_size)),
            page_size: Number(page_size),
            current_page: Number(page),
            count: data.length
        }
        return {
            pagination,
            data
        }
    }
};
