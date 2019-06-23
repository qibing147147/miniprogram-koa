const {Sequelize, Model} = require('sequelize')
const {
  dbName,
  port,
  user,
  password,
  host
} = require('../config/config').database
const {
  unset,
  clone,
  isArray
} = require('lodash')

const sequelize = new Sequelize(dbName, user, password, {
  port,
  host,
  dialect: 'mysql',
  logging: true,
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude:['updated_at','deleted_at','created_at']
        }
      }
    }
  },
})

sequelize.sync({force: false})

Model.prototype.toJSON = function() {
  let data = clone(this.dataValues)
  unset(data, 'updatedAt')
  unset(data, 'createdAt')
  unset(data, 'deletedAt')
  for (const key in data) {
    if (key === 'image' && !data[key].startsWith('http')) {
      data[key] = global.config.host + data[key]
    }
  }
  if (isArray(this.exclude)) {
    this.exclude.forEach(item => {
      unset(data, item)
    })
  }
  return data
}

module.exports = {
  sequelize
}