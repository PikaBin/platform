/**
 * 运营商基础信息
 * 图片应该是什么类型的？buffer还是url
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operatorSchema = new Schema({
  operatorID: Schema.Types.ObjectId,
  operatorName: { type: String, required: true },
  operatorAddTime: { type: Date, required: true },
  operatorReviseTime: { type: Date },
  operatorDeleteTime: { type: Date },
  operatorIntroduction: { type: String, required: true },
  content: { type: String, required: true },
  operatorProof: { type: Buffer, required: true },
  legalPerson: { type: String, required: true },
  legalPersonIdNo: { type: String, required: true },
  legalPersonPhone: { type: String, required: true },
  legalPersonEmail: { type: String, required: true },
  legalPersonPhoto: { type: Buffer, required: true },
  legalPersonAdress: { type: String, required: true },
  operatorExamineTF: { type: String, required: true },
  operatorReason: { type: String },
  operatorState: { type: String, required: true },
});

module.exports = mongoose.model('Operator', operatorSchema);
