/**
 * 现金流动表，记录了每笔订单各角色的分成
 * 工单依赖大小写注意一下
 * 如果有默认时间，返回的是时间戳而不是具体的时间，需要转换；
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashflowSchema = new Schema({
  _id: Schema.Types.ObjectId,
  orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  workOrderID: { type: Schema.Types.ObjectId, ref: 'workOrder', required: true },
  price: { type: Number, ref: 'Servicer', required: true },
  userPayable: { type: Number, ref: 'Servicer', required: true },
  refund: { type: Number, ref: 'Servicer', required: true },
  servicerID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
  serverReceivable: { type: Number, ref: 'Servicer', required: true },
  serverTF: { type: Boolean, ref: 'Servicer', required: true },
  operatorID: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  operatorReceivable: { type: Number, ref: 'Servicer', required: true },
  operatorTF: { type: Boolean, ref: 'Servicer', required: true },
  systemReceivable: { type: Number, ref: 'Servicer', required: true },
  addTime: { type: Date, ref: 'Servicer', required: true, default: Date.now() },
  note: { type: String, required: true },
});

module.exports = mongoose.model('Cashflow', cashflowSchema);
