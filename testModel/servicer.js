'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicerSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  servicerName: { type: String, required: true },

});
module.exports = mongoose.model('Servicer', ServicerSchema);
