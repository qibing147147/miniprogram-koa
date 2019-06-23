const Koa = require('koa')
const parser = require('koa-bodyparser')
const static = require('koa-static')
const path = require('path')
const catchError = require('./middlewares/exception')

require('./app/models/user')

const app = new Koa()
app.use(catchError)
app.use(parser())
app.use(static(path.join(__dirname, './static/')))
const InitManager = require('./core/Init')
InitManager.initCore(app)



app.listen(3000)