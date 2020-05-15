'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const itemSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    itemName: { type: String, required: true },
    itemPrice: { type: String },
    itemImages: { type: Array },
    categoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    itemIntroduction: { type: String, required: true },
    itemState: { type: String, required: true }, // 单品上架状态（ 0 - 下架 / 1 - 上架 ）
    itemExamineTF: { type: String, required: true }, // 是否通过审核（0 – 未通过上架/  1 – 通过上架/  2 – 未通过修改/  3 – 通过修改/  4 – 未通过下架/  5 – 下架）
    itemReason: { type: String },
    itemAddTime: { type: Date, default: new Date() },
    itemReviseTime: { type: Date },
    itemDeleteTime: { type: Date },
    itemVerifyTime: Date,
    operatorID: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  });

  return mongoose.model('Item', itemSchema);
};
