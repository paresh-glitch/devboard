const mongoose = require('mongoose');
module.exports = mongoose.model('Task', new mongoose.Schema({
  title: String,
  done: { type: Boolean, default: false }
}));
