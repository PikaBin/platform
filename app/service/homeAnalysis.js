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

  // 首页的总销售额
  async salesVolume() {
    const Order = this.ctx.model.Order;
    const attr = "$cost";
    const result = await this.Volume(Order, attr);
    return result;
  }

  // 销售额日同比
  /**
   * 两种方法：第一种就是先算出各天的销售额，然后取出今天和昨天的数据，进行计算
   * 第二种就是利用运算符直接算出今天和昨天的销售额，然后再算出比率，
   */
  async onDay() {
    const Order = this.ctx.model.Order;
    // 计算昨天的日期
    const time = (new Date()).getTime() - 24 * 60 * 60 * 1000;
    const yesterday = new Date(time);
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { day: { $dayOfYear: "$orderTime" } },
            totalAmount: { $sum: "$cost" },
            count: { $sum: 1 },
          },
      },
      // {
      //   $project:
      //     {
      //       dayRatio:
      //     },
      // },
    ]);

    return result;
  }
}

module.exports = HomeAnalysis;
