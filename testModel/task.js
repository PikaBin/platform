'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  taskName: { type: String, required: true },

});
module.exports = mongoose.model('Task', TaskSchema);
