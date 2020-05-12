/**
 * 专才奖惩表
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RPSSchema = new Schema({
  _id: Schema.Types.ObjectId,
  contractName: { type: String, required: true },
  servicerID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
  operatorID: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  content: { type: String, required: true },
  time: { type: Date, required: true },

});

module.exports = mongoose.model('RPS', RPSSchema);
