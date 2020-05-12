'use strict';
/**
 * 订单表，包含以下属性：
 * 订单id（使用MongoDB自带的id）,单品，客户，购买时间，购买数量，
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  name: String,
  OrderbuyTime: Date,
  Orderamount: Number,

});
module.exports = mongoose.model('Order', orderSchema);
