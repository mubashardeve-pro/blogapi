'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "blogs", deps: [authers, categories]
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2026-06-17T15:18:34.807Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "blogs",
        {
            "id": {
                "type": Sequelize.UUID,
                "field": "id",
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "title": {
                "type": Sequelize.STRING,
                "field": "title",
                "allowNull": false
            },
            "slug": {
                "type": Sequelize.STRING,
                "field": "slug",
                "validate": {
                    "notEmpty": true,
                    "notNull": true
                },
                "unique": true,
                "allowNull": false
            },
            "description": {
                "type": Sequelize.TEXT,
                "field": "description",
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            },
            "author_id": {
                "type": Sequelize.UUID,
                "field": "author_id",
                "onUpdate": "CASCADE",
                "onDelete": "RESTRICT",
                "references": {
                    "model": "authers",
                    "key": "id"
                },
                "name": "author_id",
                "allowNull": false
            },
            "category_id": {
                "type": Sequelize.UUID,
                "field": "category_id",
                "onUpdate": "CASCADE",
                "onDelete": "RESTRICT",
                "references": {
                    "model": "categories",
                    "key": "id"
                },
                "name": "category_id",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
