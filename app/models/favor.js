const {
  Sequelize,
  Model,
  Op
} = require('sequelize')
const {
  sequelize
} = require('../../core/db')
const {
  Art
} = require('./art')

class Favor extends Model {
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    })
    if (favor) {
      throw new global.errs.LikeError()
    }
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id,
        type,
        uid
      }, {
        transaction: t
      })
      const art = await Art.getData(art_id, type, false)
      await art.increment('fav_nums', {
        by: 1,
        transaction: t
      })
    })
  }

  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    })
    if (!favor) {
      throw new global.errs.DislikeError()
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        transaction: t,
        force: true
      })
      const art = await Art.getData(art_id, type, false)
      await art.decrement('fav_nums', {
        by: 1,
        transaction: t
      })
    })
  }

  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    })
    return favor ? true : false
  }

  static async getBookFavors(bookId, uid) {
    const favorNums = await Favor.count({
      where: {
        art_id: bookId,
        uid
      }
    })
    const myFavor = await Favor.findOne({
      art_id: bookId,
      uid,
      type: 400
    })
    return {
      fav_nums: favorNums,
      like_status: myFavor ? 1 : 0
    }
  }

  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
        }
      }
    })
    if (!arts.length) {
      throw new global.errs.NotFound()
    }
    const infos = await Art.getList(arts)
    return infos
  }
}

Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
}, {
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}