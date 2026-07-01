'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "authers", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2026-06-17T14:53:39.535Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "authers",
        {
            "id": {
                "type": Sequelize.UUID,
                "field": "id",
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "field": "name",
                "allowNull": false
            },
            "email": {
                "type": Sequelize.STRING,
                "field": "email",
                "validate": {
                    "isEmail": true,
                    "notEmpty": true,
                    "notNull": true
                },
                "unique": true,
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
