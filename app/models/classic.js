const {
  sequelize
} = require('../../core/db')
const {
  Sequelize,
  Model
} = require('sequelize')

const classicFields = {
  image: {
    type: Sequelize.STRING,
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {

}

Movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})

class Sentence extends Model {

}

Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})


class Music extends Model {

}

Music.init({
  ...classicFields,
  url: Sequelize.STRING
}, {
  sequelize,
  tableName: 'music'
})

module.exports = {
  Movie,
  Sentence,
  Music
}