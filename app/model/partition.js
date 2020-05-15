/**
 * 单品分区表
 */
'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const partitionSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    itemID: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    name: { type: String, required: true },
    introduction: { type: String, required: false },
    price: { type: Number, required: true },
    applicable: { type: String }, // 应用场景
    industry: String, // 适用行业
    style: { type: String },
    detail: { type: String }, // 服务详情
    type: { type: String }, // 类型
    reason: String, // 弃用/上架理由
    options: Schema.Types.Mixed, // 补充字段
  });

  return mongoose.model('Partition', partitionSchema);
};
