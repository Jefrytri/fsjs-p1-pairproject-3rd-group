'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Profile.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Profile.init({
    bio: {
      type: DataTypes.TEXT
    },
    avatarUrl: {
      type: DataTypes.STRING
    },
    displayAvatar: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.avatarUrl || 'https://shorturl.at/bhyxk';
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'UserId is required'
        },
        notEmpty: {
          msg: 'UserId is required'
        }
      }
    }  
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};