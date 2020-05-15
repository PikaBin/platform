/**
 * 订单控制器
 */
'use strict';
const { Controller } = require('egg');

class OrderController extends Controller {

  // 根据订单相关信息，查询订单
  async queryOrder() {
    const result = await this.ctx.service.order.queryOrder();
    this.ctx.body = result;
  }

  // 根据订单id,查询订单相应的工单
  async queryWorkorder() {
    const result = await this.ctx.service.order.queryWorkorder();
    this.ctx.body = result;
  }
}

module.exports = OrderController;
