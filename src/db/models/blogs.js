'use strict';
const { Model} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {
    static associate(models) {

      blogs.belongsTo(models.authers, { 
        foreignKey:{
          name:'author_id',
          allowNull: false,
        }, 
        as: 'author',
        onDelete: 'RESTRICT'
      });


      blogs.belongsTo(models.categories, { 
        foreignKey:{
          name:'category_id',
          allowNull: false,
        }, 
        as: 'category',
        onDelete: 'RESTRICT'
      });


    }
  }



  blogs.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    }
  }, {
    sequelize,
    modelName: 'blogs',
  });



  return blogs;
};