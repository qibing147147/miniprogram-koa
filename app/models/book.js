const util = require('util')
const {Sequelize, Model} = require('sequelize')
const axios = require('axios')
const {sequelize} = require('../../core/db')
const {Favor} = require('../models/favor')

class Book extends Model {
  async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id)
    const result = await axios.get(url)
    return result.data
  }
  static async searchBookFromYuShu(q, count, start, summary = 1) {
    const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const books = await axios.get(url)
    return books.data
  }
  static async getFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        uid,
        type: 400
      }
    })
    return count
  }
}

Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'book'
})

module.exports = {
  Book
}
