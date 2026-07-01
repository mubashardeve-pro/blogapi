'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "is_published" to table "blogs"
 *
 **/

var info = {
    "revision": 5,
    "name": "noname",
    "created": "2026-06-25T18:50:45.542Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "blogs",
        "is_published",
        {
            "type": Sequelize.BOOLEAN,
            "field": "is_published",
            "defaultValue": false,
            "allowNull": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: async function(queryInterface, Sequelize)
    {
        const blogsTable = await queryInterface.describeTable('blogs');

        if (!blogsTable.is_published) {
            await queryInterface.addColumn('blogs', 'is_published', {
                type: Sequelize.BOOLEAN,
                field: 'is_published',
                defaultValue: false,
                allowNull: false,
            });
        }
    },
    info: info
};
