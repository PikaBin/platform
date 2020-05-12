'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AdjustSchema = new Schema({
    read: { type: String, default: '0' }, // 是否已读，0表示未读，1表示已读
    objectId: { type: Schema.Types.ObjectId, required: true }, // 对象索引id
    object: { type: String, required: true }, // 审核对象，c：品类，o:运营商，I:单品，i: 中断要求,p:分区,t:任务
    action: { type: String, required: true }, // 动作标识，0：增加，1：修改，2：删除，上架：3，下架：4，
    auditorID: { type: String }, // 审核员ID
    auditTime: Date, // 审核时间
    applyTime: { type: Date, required: true, default: new Date() }, // 申请时间
    result: { type: String }, // 审核结果
    auditStatus: { type: String, required: true, default: '0' }, // 审核状态， 0：未审核，1：审核通过，2：审核不通过
    timestamp: { type: Number, default: Date.now() }, // 时间戳，
    options: Schema.Types.Mixed, // 补充字段
    changedData: Schema.Types.Mixed, // 存放申请时传入的已改动数据
  });

  return mongoose.model('Adjust', AdjustSchema);
};
