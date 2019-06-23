const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/book'
})
const {Auth} = require('../../../middlewares/auth')
const {HotBook} = require('../../models/hot_book')
const {PositiveIntegerValidator, SearchValidator, AddShortCommentValidator} = require('../../validators/validator')
const {Book} = require('../../models/book')
const {Favor} = require('../../models/favor')
const {Comment} = require('../../models/book-comment')
const {success} = require('../../lib/helper')

router.get('/', (ctx, next) => {
  ctx.body = {key: 'book'}
  throw new Error('book异常')
})

router.get('/hot_list', new Auth().m, async(ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = books
})

router.get('/:id/detail', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const detail = await new Book().detail(v.get('path.id'))
  ctx.body = detail

})

router.get('/search', new Auth().m, async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const books = await Book.searchBookFromYuShu(v.get('query.q'), v.get('query.count'), v.get('query.start'))
  ctx.body = books
})

router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

router.get('/:book_id/favor', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id'
  })
  const favor = await Favor.getBookFavors(v.get('path.book_id'), ctx.auth.uid)
  ctx.body = favor
})

router.post('/add/short_comment', new Auth().m, async ctx => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: 'book_id'
  })
  await Comment.addComment(v.get('body.book_id'), v.get('body.content'))
  success()
})

router.get('/:book_id/short_comment', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id'
  })
  ctx.body = await Comment.getComments(v.get('path.book_id'))
  
})

module.exports = router