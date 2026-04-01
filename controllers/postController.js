const { Op } = require('sequelize')
const { Post, Tag, PostTag, User, Like, Comment, Profile } = require('../models')
const { getLocation } = require('../helpers/ipLocation')
const { generatePostQR } = require('../helpers/qrcode')

class PostController {
  static async list(req, res, next) {
    try {
      const { search, msg, error } = req.query

      let posts

      if (search && search.startsWith('#')) {
      const tagName = search.toLowerCase()
      posts = await Post.getPostsByTag(tagName)

      } else if (search) {
        
        posts = await Post.findAll({
          where: {
            title: {
              [Op.iLike]: `%${search}%`
            }
          },
          include: [
            { association: 'User', include: ['Profile'] },
            'Comments',
            'Likes',
            'Tags'
          ],
          order: [['createdAt', 'DESC']]
        })

      } else {
        
        posts = await Post.findAll({
          include: [
            { association: 'User', include: ['Profile'] },
            'Comments',
            'Likes',
            'Tags'
          ],
          order: [['createdAt', 'DESC']]
        })
      }

      res.render('posts/list', {
        posts,
        search: search || '',
        msg,
        error
      })
    } catch (error) {
      next(error)
    }
  }

  static async showAdd(req, res, next) {
    try {
      const { error } = req.query
      res.render('posts/add', { error })
    } catch (error) {
      next(error)
    }
  }

  static async add(req, res, next) {
    try {
      const { title, content, imgUrl, hashtags } = req.body

      const ip = req.ip
      const location = await getLocation(ip)

      const post = await Post.create({
        title,
        content,
        imgUrl,
        userId: req.session.userId,
        ipAddress: location.ipAddress,
        city: location.city,
        region: location.region,
        country: location.country
      })

      if (hashtags) {
        const hashtagList = hashtags.split(' ')

        for (let tagRaw of hashtagList) {
          let tagName = tagRaw.trim().toLowerCase()

          if (!tagName) continue
          if (tagName[0] !== '#') continue

          let tag = await Tag.findOne({ where: { name: tagName } })

          if (!tag) {
            tag = await Tag.create({ name: tagName })
          }

          const exist = await PostTag.findOne({
            where: {
              postId: post.id,
              tagId: tag.id
            }
          })

          if (!exist) {
            await PostTag.create({
              postId: post.id,
              tagId: tag.id
            })
          }
        }
      }

      res.redirect('/posts?msg=Post created successfully')
    } catch (error) {
      next(error)
    }
  }

  static async detail(req, res, next) {
  try {
    const { id } = req.params

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          include: [Profile]
        },
        Tag,
        Like,
        {
          model: Comment,
          include: [User]
        }
      ]
    })

    if (!post) throw new Error('Post not found')

    const qrCode = await generatePostQR(post.id)

    res.render('posts/detail', { post, qrCode })
  } catch (error) {
    next(error)
  }
}

  static async showEdit(req, res, next) {
    try {
      const { id } = req.params

      const post = await Post.findByPk(id, {
        include: [Tag]
      })

      if (!post) throw new Error('Post not found')

      if (post.userId !== req.session.userId) {
        throw new Error('You are not authorized')
      }

      const hashtags = post.Tags.map(tag => tag.name).join(' ')

      res.render('posts/edit', { post, hashtags })
    } catch (error) {
      next(error)
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params
      const { title, content, imgUrl, hashtags } = req.body

      const post = await Post.findByPk(id, {
        include: [Tag]
      })

      if (!post) throw new Error('Post not found')

      if (post.userId !== req.session.userId) {
        throw new Error('You are not authorized')
      }

      await post.update({ title, content, imgUrl })

      await PostTag.destroy({
        where: { postId: post.id }
      })

      if (hashtags) {
        const hashtagList = hashtags.split(' ')

        for (let tagRaw of hashtagList) {
          let tagName = tagRaw.trim().toLowerCase()

          if (!tagName) continue
          if (tagName[0] !== '#') continue

          let tag = await Tag.findOne({ where: { name: tagName } })

          if (!tag) {
            tag = await Tag.create({ name: tagName })
          }

          await PostTag.create({
            postId: post.id,
            tagId: tag.id
          })
        }
      }

      res.redirect(`/posts/${id}`)
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params

      const post = await Post.findByPk(id,{
                  include: ['User']
                  })
      if (!post) throw new Error('Post not found')

      const isOwner = post.userId === req.session.userId
      const isAdmin = req.session.role === 'admin'

      if (!isOwner && !isAdmin) {
        throw new Error('You are not authorized')
      }

      await post.destroy()

      res.redirect(`/posts?msg=Post from ${post.User.username} deleted successfully`)
    } catch (error) {
      next(error)
    }
  }

  static async like(req, res, next) {
    try {
      const { id } = req.params

      const existing = await Like.findOne({
        where: {
          userId: req.session.userId,
          postId: id
        }
      })

      if (!existing) {
        await Like.create({
          userId: req.session.userId,
          postId: id
        })
      }

      res.redirect(`/posts#post-${id}`)
    } catch (error) {
      next(error)
    }
  }

  static async unlike(req, res, next) {
    try {
      const { id } = req.params

      await Like.destroy({
        where: {
          userId: req.session.userId,
          postId: id
        }
      })

      res.redirect(`/posts#post-${id}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PostController