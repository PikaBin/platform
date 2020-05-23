/* eslint-disable quotes */
'use strict';
/**
 * 平台首页 数据分析
 */
const { Service } = require('egg');

class HomeAnalysis extends Service {

  /**
 * 获取某一指标数的总额数量
 * @param {Model} Target 目标model
 * @param {String} attr model中要计算的数量属性
 */
  async Volume(Target, attr) {
    try {
      // 获取总额
      const result = await Target.aggregate([{
        $group: {
          _id: null,
          totalAmount: { $sum: attr },
        },
      }]);
      console.log('让我看看总额是多少：', result);

      return {
        status: '1',
        information: '获取成功',
        result,
      };

    } catch (err) {
      console.log('数量总额：', err);
      return {
        information: '获取失败',
        status: '0',
        error: err.message,
      };
    }
  }

  // 首页的总销售额相关
  async salesVolume() {
    const Order = this.ctx.model.Order;

    // 获取总额
    try {
      // 获取总的销售额
      const str = "$cost";
      const result = await Order.aggregate([{
        $group: {
          // _id: { day: { $dayOfYear: "$orderTime" }, year: { $year: "$orderTime" } },
          _id: null,
          totalAmount: { $sum: str },
          count: { $sum: 1 },
        },
      }]);
      console.log('让我看看这是什么：', result);

      // 获取按周期划分的销售额
      const yearData = await Order.aggregate([{
        $group: {
          _id: { month: { $month: "$orderTime" }, year: { $year: "$orderTime" } },
          totalAmount: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      }]);

      // 计算增长比

      return {
        status: '1',
        information: '分析成功',
        yearData,
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
