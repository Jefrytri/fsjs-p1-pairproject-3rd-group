'use strict';
const { hashPassword } = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  User.hasOne(models.Profile, { foreignKey: 'userId' })
  User.hasMany(models.Post, { foreignKey: 'userId' })
  User.hasMany(models.Comment, { foreignKey: 'userId' })
  User.hasMany(models.Like, { foreignKey: 'userId' })
    } 
  }
  User.init({
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Username is required'
          },
          notEmpty: {
            msg: 'Username is required'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already used'
        },
        validate: {
          notNull: {
            msg: 'Email is required'
          },
          notEmpty: {
            msg: 'Email is required'
          },
          isEmail: {
            msg: 'Invalid email format'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password is required'
          },
          notEmpty: {
            msg: 'Password is required'
          },
          len: {
            args: [8, 255],
            msg: 'Password minimum 8 characters'
          }
        }
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
          isIn: {
            args: [['admin', 'user']],
            msg: 'Role must be admin or user'
          }
        }
      }
  }, {
      sequelize,
        modelName: 'User',
        hooks: {
        beforeCreate(user) {
          user.password = hashPassword(user.password)
          }
        }
      });
      
  return User;
};