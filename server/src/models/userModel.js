const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlegnth: 3, maxlength: 40},
  email: { type: String, require: true, unique: true },
})

module.exports = mongoose.model('UserCollection', userSchema)