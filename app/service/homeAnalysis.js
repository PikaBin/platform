/* eslint-disable quotes */
'use strict';
/**
 * 平台首页 数据分析
 */
const { Service } = require('egg');
// const sillyTime = require('silly-datetime'); // 时间格式化

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

  // 首页的总销售额
  async salesVolume() {
    const Order = this.ctx.model.Order;
    const attr = "$cost";
    const result = await this.Volume(Order, attr);
    return result;
  }

  // 订单成交量总额
  async orderVolume() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([{
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    }]);

    return result;
  }

  /**
   * 销售额日同比,每日销售额
   * 算出今天，再算出总数，再进行计算既可，四舍五入保留两位小数
   */
  async saleonDay() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { day: { $dayOfYear: "$orderTime" } },
            totalAmount: { $sum: "$cost" },
          },
      },
    ]);
    // const salesVolume = await this.salesVolume();
    // console.log(salesVolume);
    // const totalAmount = salesVolume.result[0].totalAmount;
    // console.log(totalAmount);
    // 今天的销售额
    const today = result[0].totalAmount;
    // console.log(today);

    // 昨日的 销售额
    const yesterday = result[1].totalAmount;

    // 日比增长率
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      result,
    };
  }

  // 每日成单量 以及增长率
  async orderOnday() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { day: { $dayOfYear: "$orderTime" } },
            count: { $sum: 1 },
          },
      },
    ]);

    // 今天的成单量
    const today = result[0].count;
    // console.log(today);

    // 昨日的成单量
    const yesterday = result[1].count;

    // 日比增长率
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      result,
    };

  }
}

module.exports = HomeAnalysis;
