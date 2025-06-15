const mongoose = require("mongoose")

const perfumeSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 50, required: true },
  notes: [{ type: String }],
  image: { type: String } ,
  links: {
    shopee: { type: String },
    lazada: { type: String },
    tiktok: { type: String }
  },
  ratings: { type: Number },
  reviews: [{ type: String }],
  inspiration: { type: String, minlength: 3, maxlength: 50 },
  projection: { type: Number },
  performance: { type: Number },
  longevity: { type: Number },
  sillage: { type: Number },
  og_similarity: { type: Number }
})

module.exports = mongoose.model('PerfumeCollection', perfumeSchema)

