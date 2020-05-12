'use strict';

/**
 * 工单表 字段设计说明：
 * 不足：
 * 0.时间类型的属性，没有设置默认时间（因为时区转换）；
 * 1.W_itemPartition属性值是单品分区id，并不是单品id,这个能不能自动依赖
 * 2.状态码内容限定问题
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const workOrderSchema = new Schema({
    _id: Schema.Types.ObjectId,
    W_name: { type: String },
    W_servicer: { type: String, ref: 'Servicer' },
    W_itemPartition: { type: String, required: true }, // 由于分区id删除，所以改为string
    orderID: { type: String, ref: 'Order' },
    W_operatorID: { type: Schema.Types.ObjectId, ref: 'Operator' },
    W_state: { type: String, required: true }, // 工单状态（0 – 结束 / 1 – 进行中 / 2 – 待分配 / 3 – 用户终止）
    W_startTime: { type: Date }, // 工单产生时间
    W_endTime: { type: Date }, // 工单结束时间
    W_serverTime: { type: Date }, // 服务启动时间
    requirement: { type: String }, // 下单客户特别的要求
    customerPhone: String,
    // log: {
    //   _id: Schema.Types.ObjectId,
    //   name: { type: String, required: true },
    //   content: { type: String, required: true },
    //   start: { type: Date, required: true },
    //   end: { type: Date, required: true },
    //   Servicer_feedback: { type: String, required: true },
    //   Customer_feedback: { type: String },
    //   deadline: { type: Date },
    //   state: { type: String, required: true },
    // },
    log: Array, // 工单日志
  });

  return mongoose.model('Workorder', workOrderSchema);
};

