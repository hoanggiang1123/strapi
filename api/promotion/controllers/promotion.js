'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');
const { tableOfContents } = require('../../../helpers/toc.js')

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
    },
    async findDetail (ctx) {
        let resp = await strapi.services.promotion.find(ctx.query)
        resp = resp.map(entity => sanitizeEntity(entity, { model: strapi.models.promotion }));
        if (resp.length && resp[0].content) {
            let newContent = tableOfContents(resp[0].content, {})
            if (newContent) resp[0].content = newContent;
            return resp[0];
        }
        return [];
    }
};
