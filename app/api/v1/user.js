
const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const {RegisterValidator} = require('../../validators/validator')
const {User} = require('../../models/user')
const {success} = require('../../lib/helper')


router.post('/register', async (ctx) => {
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }
  await User.create(user)
  success()
})

module.exports = router