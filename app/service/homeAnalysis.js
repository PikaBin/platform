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

  // 获取某一指标的每日数量以及日增长比
  async onDay(target, attr, time) {
    // const Order = this.ctx.model.Order;
    const result = await target.aggregate([
      {
        $group:
          {
            _id: { day: { $dayOfYear: time } },
            totalAmount: { $sum: attr },
          },
      },
    ]);

    // 今天的数据
    const today = result[0].totalAmount;
    // console.log(today);

    // 昨日的数据
    const yesterday = result[1].totalAmount;

    // 日比增长率
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      result,
    };
  }

  // 首页的总销售额
  async salesVolume() {
    const Order = this.ctx.model.Order;
    const attr = "$cost";
    const result = await this.Volume(Order, attr);
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
      {
        $sort: { week: -1 },
      },
    ]);

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

  // 本月的销售额
  async saleonMonth() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { month: { $month: "$orderTime" }, dayOfMonth: { $dayOfMonth: "$orderTime" } },
            totalAmount: { $sum: "$cost" },
          },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的销售额
    const monthData = []; // 存储本周数据、
    const month = result[0]._id.month; // 获取本周是第几周
    console.log(month);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.month === month) {
        monthData.push(result[i]);
      }
    }

    return {
      monthData,
      result,
    };
  }

  // 本年的销售额
  async saleonYear() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { month: { $month: "$orderTime" }, year: { $year: "$orderTime" } },
            totalAmount: { $sum: "$cost" },
          },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的销售额
    const yearData = []; // 存储本周数据、
    const year = result[0]._id.year; // 获取本周是第几周
    console.log(year);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.year === year) {
        yearData.push(result[i]);
      }
    }

    return {
      yearData,
      result,
    };
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

  // 本月的成交量
  async orderonMonth() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
            {
              _id: { month: { $month: "$orderTime" }, dayOfMonth: { $dayOfMonth: "$orderTime" } },
              count: { $sum: 1 },
            },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的成交量
    const monthData = []; // 存储本月数据
    const month = result[0]._id.month; // 获取本月是第几月
    console.log(month);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.month === month) {
        monthData.push(result[i]);
      }
    }

    return {
      monthData,
      result,
    };
  }

  // 本年的成交量
  async countOnYear() {
    const Order = this.ctx.model.Order;
    const result = await Order.aggregate([
      {
        $group:
          {
            _id: { month: { $month: "$orderTime" }, year: { $year: "$orderTime" } },
            count: { $sum: 1 },
          },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的销售额
    const yearData = []; // 存储本周数据、
    const year = result[0]._id.year; // 获取本周是第几周
    console.log(year);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.year === year) {
        yearData.push(result[i]);
      }
    }

    return {
      yearData,
      result,
    };
  }

  // 应收账款总额
  async profitVolume() {
    const Cashflow = this.ctx.model.Cashflow;
    const attr = "$systemReceivable";
    const result = await this.Volume(Cashflow, attr);
    return result;
  }

  // 本月应收账款
  async profitOnMonth() {
    const Cashflow = this.ctx.model.Cashflow;
    const result = await Cashflow.aggregate([
      {
        $group:
          {
            _id: { month: { $month: "$addTime" }, dayOfMonth: { $dayOfMonth: "$addTime" } },
            profit: { $sum: "$systemReceivable" },
          },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的应收账款
    const monthData = []; // 存储本月数据
    const month = result[0]._id.month; // 获取本月是第几月
    console.log(month);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.month === month) {
        monthData.push(result[i]);
      }
    }

    // 计算日比
    // 今天的成单量
    const today = result[0].profit;
    // console.log(today);

    // 昨日的成单量
    const yesterday = result[1].profit;

    // 日比增长率
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      monthData,
    };
  }

  // 本年的成交量
  async profitOnYear() {
    const Cashflow = this.ctx.model.Cashflow;
    const result = await Cashflow.aggregate([
      {
        $group:
            {
              _id: { month: { $month: "$addTime" }, year: { $year: "$addTime" } },
              count: { $sum: "$systemReceivable" },
            },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的销售额
    const yearData = []; // 存储本年数据、
    const year = result[0]._id.year; // 获取年份
    console.log(year);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.year === year) {
        yearData.push(result[i]);
      }
    }

    return {
      yearData,
      result,
    };
  }

  // 应付账款总额
  async debtVolume() {
    const Cashflow = this.ctx.model.Cashflow;
    const total = await Cashflow.aggregate([
      {
        $match: { state: { $in: [ "1", "0" ] } },
      },
      {
        $group: {
          // _id: { day: { $dayOfMonth: "$addTime" } },
          _id: null,
          debt: { $sum: { $subtract: [ "$userPayable", "$systemReceivable" ] } },
        },
      },
    ]);
    return total;
  }

  // 本月的应付款总额
  async debtOnMonth() {

    const Cashflow = this.ctx.model.Cashflow;
    const result = await Cashflow.aggregate([
      {
        $match: { state: { $in: [ "1", "0" ] } },
      },
      {
        $group:
            {
              _id: { month: { $month: "$addTime" }, dayOfMonth: { $dayOfMonth: "$addTime" } },
              debt: { $sum: { $subtract: [ "$userPayable", "$systemReceivable" ] } },
            },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 本月的应收账款
    const monthData = []; // 存储本月数据
    const month = result[0]._id.month; // 获取本月是第几月
    console.log(month);
    for (let i = 0; i < result.length; i++) {
      if (result[i]._id.month === month) {
        monthData.push(result[i]);
      }
    }

    // 计算日比
    // 今天的成单量
    const today = result[0].debt;
    // console.log(today);

    // 昨日的成单量
    const yesterday = result[1].debt;

    // 日比增长率
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      monthData,
    };
  }


}
module.exports = HomeAnalysis;
