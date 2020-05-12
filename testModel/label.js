/**
 * 品类标签:各个属性详细含义请看雅君运营商文档，
 * 不足：labelState，labelExamineTF 这两个状态属性应该限制内容，成为可选；
 */
'use strict';
const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const labelSchema = new Schema({
  labelID: Schema.Types.ObjectId,
  labelName: { type: String, required: true },
  labelIntroduction: { type: String, required: true },
  labelContent: { type: String, required: true },
  labelState: { type: String, required: true },
  labelExamineTF: { type: String, required: true },
  labelReason: { type: String },
  labelAddtime: { type: Date, required: true },
  labelReviseTime: { type: Date, required: true },
  labelDeleteTime: { type: Date },
});

module.exports = moongoose.model('Lable', labelSchema);
