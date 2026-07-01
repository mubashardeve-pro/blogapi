'use strict';
const { Model} = require('sequelize');



module.exports = (sequelize, DataTypes) => {

  class authers extends Model {
    
    static associate(models) {
      
      authers.hasMany(models.blogs, { 
        foreignKey:{
          name:'author_id',
          allowNull: false,
        }, 
        as: 'blogs',
        onDelete: 'RESTRICT'
      });

    }
  }


  authers.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: {
          msg: 'Name is required',
        },
        notNull: true,
        len: [3, 100],
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        notNull: true,
      },
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    }
  }, {
    sequelize,
    modelName: 'authers',
  });



  return authers;
};