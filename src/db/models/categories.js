'use strict';
const { Model} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    static associate(models) {
      
      categories.hasMany(models.blogs, { 
        foreignKey:{
          name:'category_id',
          allowNull: false,
        }, 
        as: 'blogs',
        onDelete: 'RESTRICT'
      });


    }
  }



  categories.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
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
    }
  }, {
    sequelize,
    modelName: 'categories',
  });



  return categories;
};