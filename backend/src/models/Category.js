const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: String,
  name: String,
  videos: [{ type: mongoose.Schema.Types.String, ref: 'Video', required: false }],
});

module.exports = mongoose.model('Category', categorySchema);
