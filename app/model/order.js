'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const moment = require('moment');
  moment.locale('zh-cn');

  const orderSchema = new Schema({
    orderId: { type: String, required: true, unique: true }, // 订单ID
    orderState: { type: String, default: '0' }, // 订单进度状态（0：已接单尚未变为工单；1 ：已接单且已变为便为工单；2：已接单且已分配专才；
    // 3：订单确认开始；4:订单取消；5：订单完成； ）
    orderStartState: { type: String, required: false }, // 订单开始状态（0：专才接单后默认服务开始；1：要客户确认后订服务才开始）
    cost: { type: Number, required: false }, // 应付款
    orderTime: { type: Date, required: true }, // 下单时间
    partitionId: { type: String, required: false }, // 服务分区ID
    remark: { type: String, required: false }, // 备注
    purchaseQuantity: { type: String, required: false }, // 购买数量
    customerId: { type: String, required: false }, // 买家id
    phone: { type: String, required: false }, // 联系电话
    orderStartTime: { type: Date, required: false }, // 订单开始时间
  });
  return mongoose.model('Order', orderSchema);
};
