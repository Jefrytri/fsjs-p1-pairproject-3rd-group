'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    
    static async getPostsByTag(tagName) {
      
      return await this.findAll({
            include: [
          {
            association: 'User',
            include: ['Profile']
          },
          {
            association: 'Tags',
            where: {
              name: tagName
            }
          },
          'Comments',     
          'Likes'           
        ],
        order: [['createdAt', 'DESC']]
      })
    }

 getLikeCount() {
    return this.Likes ? this.Likes.length : 0
  }

    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' })

      Post.hasMany(models.Comment, { foreignKey: 'postId' })
      Post.hasMany(models.Like, { foreignKey: 'postId' })

      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
        foreignKey: 'postId'
      })
    }
  }

  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title is required'
          },
          notEmpty: {
            msg: 'Title is required'
          }
        }
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Content is required'
          },
          notEmpty: {
            msg: 'Content is required'
          }
        }
      },

      imgUrl: {
        type: DataTypes.STRING
      },

      ipAddress: {
        type: DataTypes.STRING
      },

      city: {
        type: DataTypes.STRING
      },

      region: {
        type: DataTypes.STRING
      },

      country: {
        type: DataTypes.STRING
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'UserId is required'
          },
          notEmpty: {
            msg: 'UserId is required'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Post'
    }
  );

  return Post;
};