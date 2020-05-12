/**
 * 单品表，属性详细解释见 运营商文档（雅君）
 * 此外部分依赖还没有实现，如下：
 * partition：单品分区【品类表】
	- price：价格【minPrice < price < maxPrice】
	- task：必要任务【minTasks < task个数 < maxTasks】
      - maxCompletionTime:任务最长执行时间【maxCompletionTime < maxTaskTime】
      - receivable：任务终止收成【依附于interruptRequest】

 */


'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  itemName: { type: String, required: true },
  itemCategoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  itemIntroduction: { type: String, required: true },
  itemItate: { type: String, required: true },
  itemExamineTF: { type: String, required: true },
  itemReason: { type: String },
  itemAddTime: { type: Date, required: true, default: Date.now() },
  itemReviseTime: { type: Date },
  itemDeleteTime: { type: Date },

  /** 单品分区 */
  partition: {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    introduction: { type: String, required: true },
    price: { type: Number, required: true },
    applicable: { type: String, required: true },
    style: { type: String, required: true },
    industry: { type: String, required: true },
    type: { type: String, required: true },
    task: {
      _id: Schema.Types.ObjectId,
      name: { type: String, required: true },
      introduction: { type: String, required: true },
      conditions: { type: String, required: true },
      maxCompletionTime: { type: String, required: true },
      passageConditions: { type: String, required: true },
      receivable: { type: String, required: true },
      before: { type: String },
      after: { type: String },
    },

  },

});
module.exports = mongoose.model('Item', ItemSchema);

