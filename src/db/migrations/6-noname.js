'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "image_url" to table "blogs"
 *
 **/

var info = {
    "revision": 6,
    "name": "noname",
    "created": "2026-06-29T00:00:00.000Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "blogs",
        "image_url",
        {
            "type": Sequelize.STRING,
            "field": "image_url",
            "allowNull": false,
            "defaultValue": "https://placehold.co/1200x630/png?text=Blog+Image"
        }
    ]
}];

module.exports = {
    pos: 0,
    up: async function(queryInterface, Sequelize)
    {
        const blogsTable = await queryInterface.describeTable('blogs');

        if (!blogsTable.image_url) {
            await queryInterface.addColumn('blogs', 'image_url', {
                type: Sequelize.STRING,
                field: 'image_url',
                allowNull: false,
                defaultValue: 'https://placehold.co/1200x630/png?text=Blog+Image',
            });
        }
    },
    info: info
};
