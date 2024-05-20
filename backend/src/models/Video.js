const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  categories: [{ type: mongoose.Schema.Types.String, ref: 'Category' }], // Array de referências ao modelo 'Category'
  thumbnail: String,
  videoUrl: String,
});

module.exports = mongoose.model('Video', videoSchema);
