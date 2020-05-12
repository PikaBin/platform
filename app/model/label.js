'use strict';

// 定义品类标签模型
/**
 * 品类标签:各个属性详细含义请看雅君运营商文档，
 * 不足：labelState，labelExamineTF 这两个状态属性应该限制内容，成为可选；
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const labelSchema = new Schema({
    labelID: Schema.Types.ObjectId,
    labelName: { type: String, required: true },
    labelIntroduction: { type: String, required: true },
    labelContent: { type: String, required: true },
    labelState: { type: String, required: true },
    labelExamineTF: { type: String, required: true },
    labelReason: { type: String },
    labelAddtime: { type: Date, required: true },
    labelReviseTime: { type: Date },
    labelDeleteTime: { type: Date },
  });
  return mongoose.model('Label', labelSchema);
};
