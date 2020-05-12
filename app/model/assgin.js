'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const assginSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    workorderID: Schema.Types.ObjectId,
    state: { type: String, required: true }, // 状态（0 – 未成功 / 1 – 成功）
    servicerID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true }, // 专才id
    startTime: { type: Number, default: Date.now() }, // 一次派单的开始时间
    endTime: Date, // 派单结束时间，也是专才确认接单时间
    log: Array, // 派单日志，记录工单曾被派给过哪些专才，包含专才id,派送时间
  });
  return mongoose.model('Assgin', assginSchema);
};
