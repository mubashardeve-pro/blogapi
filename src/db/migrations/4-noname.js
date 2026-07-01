'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "password" to table "authers"
 * changeColumn "name" on table "authers"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2026-06-19T15:30:54.268Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "authers",
            "password",
            {
                "type": Sequelize.STRING,
                "field": "password",
                "validate": {
                    "notEmpty": true,
                    "notNull": true
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "authers",
            "name",
            {
                "type": Sequelize.STRING,
                "field": "name",
                "validate": {
                    "notEmpty": {
                        "msg": "Name is required"
                    },
                    "notNull": true,
                    "len": [3, 100]
                },
                "allowNull": false
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: async function(queryInterface, Sequelize)
    {
        const autherTable = await queryInterface.describeTable('authers');

        if (!autherTable.password) {
            await queryInterface.addColumn('authers', 'password', {
                type: Sequelize.STRING,
                field: 'password',
                allowNull: false,
            });
        }

        await queryInterface.changeColumn('authers', 'name', {
            type: Sequelize.STRING,
            field: 'name',
            allowNull: false,
        });
    },
    info: info
};
