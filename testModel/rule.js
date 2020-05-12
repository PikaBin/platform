'use strict';
// 定义规则模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RuleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  ruleName: { type: String, required: true },
  ruleIntrod: { type: String, required: true },
});

module.exports = mongoose.model('Rule', RuleSchema);
