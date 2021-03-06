'use strict';
/**
 * 服务品类包
 * 注意categoryReviseTime、 categoryDeleteTime、categoryReason不应该成为必填字段，
 * 拿第一个来说，如果此品类没有得到修改，自然也没有修改时间这一说
 * 一些范围验证用来在前端进行验证, minlength: 4, maxlength: 10
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryID: Schema.Types.ObjectId,
  categoryName: { type: String, required: true },
  categoryIntrod: { type: String, required: true },
  // categoryContent: { type: [ String ], required: true},
  categoryState: { type: String, required: true, enum: [ '0', '1' ] },
  categoryLabel: { type: Schema.Types.ObjectId, ref: 'Label' },
  categoryOperator: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },

  /**
   * 以下属性是品类规范（用于品类下级单品规范）
   */
  categoryExplanation: { type: String, required: true },
  categoryMinName: { type: Number, required: true },
  categoryMaxName: { type: Number, required: true },
  categoryMaxIntroduction: { type: String, required: true },
  categoryMinIntroduction: { type: String, required: true },
  categoryMaxContent: { type: String, required: true },
  categoryMinContent: { type: String, required: true },
  categoryMaxPartition: { type: Number, required: true },
  categoryMinPartition: { type: Number, required: true },
  categoryMinTasks: { type: Number, required: true },
  categoryMaxTasks: { type: Number, required: true },
  categoryMinScore: { type: Number, required: true },
  categoryMaxTaskTime: { type: Number, required: true },
  categoryMinPrice: { type: Number, required: true },
  categoryMaxPrice: { type: Number, required: true },
  categoryExamineTF: { type: String, required: true },
  categoryReason: { type: String },
  categoryAddTime: { type: Date, required: true },
  categoryReviseTime: { type: Date },
  categoryDeleteTime: { type: Date },
  interruptRequest: [ new Schema({
    _id: Schema.Types.ObjectId,
    stage: Array,
    receivable: Number,
  }) ],
});

module.exports = mongoose.model('Category', CategorySchema);
