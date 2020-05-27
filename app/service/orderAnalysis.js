/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable quotes */
'use strict';
/**
 * 订单数据分析
 */

const { Service } = require('egg');

class orderAnalysis extends Service {

  // 订单总数
  async totalOrder() {
    const Order = this.ctx.model.Order;
    const number = await Order.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return number;
  }

  // 本月订单
  async orderOnMonth() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }

  // 本年订单
  async orderOnYear() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([

      {
        $group: {
          _id: { month: { $month: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);
    return number;
  }

  // 意外中止的订单数
  async badorder() {
    const Order = this.ctx.model.Order;

    const badnumber = await Order.aggregate([
      {
        $match: { orderState: '4' },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return badnumber;
  }

  // 意外中止 每月
  async badorderOnMonth() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([
      {
        $match: { orderState: '4' },
      },
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }


  // 意外中止，每年
  async badorderOnYear() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([
      {
        $match: { orderState: '4' },
      },
      {
        $group: {
          _id: { month: { $month: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);


    return {
      number,
    };
  }
  // 顺利完成 总数
  async goodorder() {
    const Order = this.ctx.model.Order;

    const goodnumber = await Order.aggregate([
      {
        $match: { orderState: '5' },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return goodnumber;
  }
  // 顺利完成，每月
  async goodorderOnMonth() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([
      {
        $match: { orderState: '5' },
      },
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }

  // 顺利完成，每年
  async goodorderOnYear() {
    const Order = this.ctx.model.Order;

    const number = await Order.aggregate([
      {
        $match: { orderState: '5' },
      },
      {
        $group: {
          _id: { month: { $month: "$orderTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      number,
    };
  }

  // 单品排行榜
  async partitionRank() {
    const Order = this.ctx.model.Order.Order;

    const partitionRank = await Order.aggregate([

      {
        $group: {
          _id: { partition: "$partitionId" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return partitionRank;
  }
}
module.exports = orderAnalysis;
