'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "image_url" on table "blogs"
 *
 **/

var info = {
    "revision": 6,
    "name": "noname",
    "created": "2026-07-01T12:47:06.376Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "blogs",
        "image_url",
        {
            "type": Sequelize.STRING,
            "field": "image_url",
            "validate": {
                "notEmpty": true,
                "notNull": true
            },
            "allowNull": false
        }
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
