/**
 * 单品
 */
'use strict';

const { Service } = require('egg');

class OrderServicer extends Service {

  /**
   * 查询订单
   */
  async queryOrder() {

    const Order = this.ctx.model.Order;
    const query = await this.ctx.query;

    try {
      const findResult = await Order.find(query);

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功,但是结果为空',
        status: '0',
      };
    } catch (err) {
      console.log('queryorder', err);

      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };

    }
  }

  /**
   * 根据订单id查询对应工单信息
   */
  async queryWorkorder() {

    // 获取订单id，查找相应的工单
    const orderId = this.ctx.query.orderId;
    const Workorder = this.ctx.model.Workorder;
    try {
      const findResult = await Workorder.find({ orderID: orderId });

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }
      return {
        information: '查询成功,但是结果为空',
        status: '2',
      };

    } catch (err) {
      console.log('queryworkorder', err);
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }
  }
}

module.exports = OrderServicer;
