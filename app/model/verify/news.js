'use strict';
/**
 * 通知运营商审核结果
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const NewsSchema = new Schema({
    object: { type: String, required: true }, // 对象标识
    action: String, // 动作标识
    read: { type: String, default: '0' }, // 是否已读，0表示未读，1表示已读
    reason: { type: String }, // 审核 产生的理由
    auditorID: { type: String }, // 审核员ID
    auditorName: String, // 审核人姓名
    auditTime: Date, // 审核时间
    result: { type: String }, // 审核结果
    timestamp: { type: Number, default: Date.now() }, // 时间戳，
    addtime: { type: Date, default: new Date() },
    verifiedData: Schema.Types.Mixed, // 存放审核的数据
  });

  return mongoose.model('News', NewsSchema);
};
