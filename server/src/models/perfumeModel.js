const mongoose = require("mongoose")

const perfumeSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 30, required: true },
  notes: [{ type: String }],
  image: { type: String } ,
  links: {
    shopee: { type: String },
    lazada: { type: String },
    tiktok: { type: String }
  },
  ratings: { type: Number },
  reviews: [{ type: String }],
  inspiration: { type: String, minlength: 3, maxlength: 30 }
})

module.exports = mongoose.model('PerfumeCollection', perfumeSchema)

