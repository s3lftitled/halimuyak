const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  coverImage: { type: String },
  description: { type: String },
  location: { type: String },
  established: { type: String },
  rating: { type: Number },
  totalReviews: { type: Number },
  followers: { type: Number },
  website: { type: String },
  fragrances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PerfumeCollection'
    }
  ],
  news: [
    {
      id: Number,
      title: String,
      date: String,
      excerpt: String,
      image: String
    }
  ]
})

module.exports = mongoose.model('BrandCollection', brandSchema)
