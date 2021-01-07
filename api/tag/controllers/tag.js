'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findAll (ctx) {
        const { lang } = ctx.query
        const resp = await strapi.query('tag').find({ 'language': lang });
        const data = resp.map(item => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            language: item.language
        }));
        return data;
    }
};
