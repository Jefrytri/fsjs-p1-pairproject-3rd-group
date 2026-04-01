'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Tag.belongsToMany(models.Post, {
    through: models.PostTag,
    foreignKey: 'tagId'
      })
    }
  }
  Tag.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Tag already exists'
    },
    validate: {
      notNull: {
        msg: 'Tag name is required'
      },
      notEmpty: {
        msg: 'Tag name is required'
      }
    } 
  }
}, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};