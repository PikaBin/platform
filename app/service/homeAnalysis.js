/* eslint-disable quotes */
'use strict';
/**
 * 平台首页 数据分析
 */
const { Service } = require('egg');

class HomeAnalysis extends Service {

  // 首页的总销售额相关
  async salesVolume() {
    const Order = this.ctx.model.Order;

    // 获取总额
    try {
      const totalAmount = await Order.find({ $sum: "$cost" });
      const result = await Order.aggregate([{
        $group: {
          _id: { day: { $dayOfYear: "$orderTime" }, year: { $year: "$orderTime" } },
          totalAmount: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      }]);

      console.log('让我看看这是什么：', result);
      return {
        status: '1',
        information: '分析成功',
        totalAmount,
        result,
      };

    } catch (err) {
      console.log('首页销售额：', err);
      return {
        information: '分析失败',
        status: '0',
        error: err.message,
      };
    }

  }
}

module.exports = HomeAnalysis;
