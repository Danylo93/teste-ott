const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  categories: [String],
  thumbnail: String,
  videoUrl: String,
});

module.exports = mongoose.model('Video', videoSchema);