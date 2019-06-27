const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoaderRouters()
    InitManager.loadConfig()
    InitManager.initHttpException()
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config'
    const config = require(configPath)
    global.config = config
  }

  static initLoaderRouters() {
    const routerPath = `${process.cwd()}/app/api`
    requireDirectory(module, routerPath, {
      visit: whenLoadModule
    })
    
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.prefix('/api').routes())
      }
    }
  }

  static initHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager