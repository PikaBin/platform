/**
 * 工单表
 * 部分问题:
 * 1.W_itemPartition属性值是单品分区id，并不是单品id,这个能不能自动依赖
 * 2.状态码内容限定问题
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workOrderSchema = new Schema({
  _id: Schema.Types.ObjectId,
  W_servicer: { type: Schema.Types.ObjectId, ref: 'Servicer' },
  W_itemPartition: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
  W_orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  W_operatorID: { type: Schema.Types.ObjectId, ref: 'Operator' },
  W_state: { type: String, required: true },
  W_startTime: { type: Date },
  W_endTime: { type: Date },
  W_serverTime: { type: Date },
  requirement: { type: String },
  log: {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    content: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    Servicer_feedback: { type: String, required: true },
    Customer_feedback: { type: String, required: true },
    deadline: { type: Date },
    state: { type: String, required: true },
  },

});

module.exports = mongoose.model('workOrder', workOrderSchema);

