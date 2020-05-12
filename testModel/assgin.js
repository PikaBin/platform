/**
 * 派单表
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assginSchema = new Schema({
  _id: Schema.Types.ObjectId,
  state: { type: String, required: true },
  serverID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
  endTime: Date,
  log: [ Schema.Types.ObjectId ],

});

module.exports = mongoose.model('Assgin', assginSchema);
