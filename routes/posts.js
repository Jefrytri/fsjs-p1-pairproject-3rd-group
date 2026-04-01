const router = require('express').Router()
const PostController = require('../controllers/postController')
const CommentController = require('../controllers/commentController')
const authentication = require('../middlewares/authentication')

router.use(authentication)

router.get('/', PostController.list)

router.get('/add', PostController.showAdd)
router.post('/add', PostController.add)

router.get('/:id', PostController.detail)

router.get('/:id/edit', PostController.showEdit)
router.post('/:id/edit', PostController.edit)

router.get('/:id/delete', PostController.delete)

router.get('/:id/like', PostController.like)
router.get('/:id/unlike', PostController.unlike)

router.post('/:postId/comments', CommentController.create)
router.get('/comments/:id/delete', CommentController.delete)

module.exports = router