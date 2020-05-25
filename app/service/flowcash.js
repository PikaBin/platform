/**
 * 计算最终的cashflow
 */

'use strict';
const Service = require('egg').Service;

class CashService extends Service {

  // 通用的查询方法
  async query(model, query) {
    try {
      const findResult = await model.find(query).sort({ timestamp: -1 });

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功，但是结果为空',
        status: '0',
      };

    } catch (err) {
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }

  }
  // 订单顺利时进行的结算
  async calculateGood(goodOrders) {

    const Contract = this.ctx.model.Contract;
    const operatorContract = this.ctx.model.Operatorcontract;
    const Workorder = this.ctx.model.Workorder;
    const Cashflow = this.ctx.model.Cashflow;

    // 循环计算
    for (let i = 0; i < goodOrders.length; i++) {
      const goodorder = goodOrders[i];
      const goodworkorder = await Workorder.findOne({ orderID: goodorder._id }).limit(1); // 查出对应的工单
      const servicerContract = await Contract.findOne({ servicerID: goodworkorder.servicer }); // 接单专才的合约
      const operator_C = await operatorContract.findOne({ operatorID: goodworkorder.operatorID }); // 运营商合约
      console.log(goodworkorder, goodworkorder.operatorID);
      const servicerCash = goodorder.cost * servicerContract.shar; // 专才所得
      console.log(goodorder.cost, servicerContract);
      const operatorCash = goodorder.cost * operator_C.shar; // 运营商所得
      const rest = goodorder.cost - servicerCash - operatorCash; // 平台所得

      // 进行最后的结算
      const updateResult = await Cashflow.updateOne({ orderId: goodorder._id },
        { serverReceivable: servicerCash, operatorReceivable: operatorCash, systemReceivable: rest });

      if (updateResult.nModified === 0) {
        return {
          information: '计算成功',
          status: '1',
        };
      }

      // 计算失败
      return {
        information: '计算失败',
        status: '0',
      };
    }
  }

  // 订单意外中止时的结算
  async calculateBad(badOrders) {

    const Contract = this.ctx.model.Contract;
    const operatorContract = this.ctx.model.Operatorcontract;
    const Workorder = this.ctx.model.Workorder;
    const WorkorderLog = this.ctx.model.Workorderlog;
    const Cashflow = this.ctx.model.Cashflow;
    const Task = this.ctx.model.Task;

    // 循环计算
    for (let i = 0; i < badOrders.length; i++) {
      const badorder = badOrders[i];
      const badworkorder = await Workorder.findOne({ orderID: badorder._id });

      // 找出扣除的分成
      const latestLog = await WorkorderLog.findOne({ workorderId: badworkorder._id }).sort({ _id: -1 }).limit(1);
      console.log('最后的反馈', latestLog);
      const task = await Task.findById(latestLog.taskId);
      console.log('task是什么：', task);
      const receiveable = task.receivable;
      console.log('分成是什么', receiveable);

      // 计算三端所得
      const servicerContract = await Contract.findOne({ servicerID: badworkorder.servicer }); // 接单的专才合同
      const operator_C = await operatorContract.findOne({ operatorID: badworkorder.operatorID }); // 接单的运营商合同
      const customer = receiveable * badorder.cost;
      console.log('客户退款', customer);
      const servicerCash = receiveable * badorder.cost * servicerContract.shar; // 专才所得
      const operatorCash = receiveable * badorder.cost * operator_C.shar; // 运营商所得
      const rest = badorder.cost - servicerCash - operatorCash - customer; // 平台所得

      // 最后结算
      const updateResult = await Cashflow.updateOne({ orderId: badorder._id },
        { serverReceivable: servicerCash, operatorReceivable: operatorCash, systemReceivable: rest, refund: customer });

      if (updateResult.nModified === 0) {
        return {
          information: '计算成功',
          status: '1',
        };
      }

      // 计算失败
      return {
        information: '计算失败',
        status: '0',
      };
    }
  }

  // 订单结算，计算最终的现金流量表
  async calculate() {
    const Order = this.ctx.model.Order;
    // const Cashflow = this.ctx.model.Cashflow;

    // 订单顺利完成
    const goodOrders = await Order.find({ orderState: '5' });
    console.log('顺利完成的订单：', goodOrders);
    const goodResult = await this.calculateGood(goodOrders);

    // 订单意外中止
    const badOrders = await Order.find({ orderState: '4' });
    console.log('意外中止的订单：', badOrders);
    const badResult = await this.calculateBad(badOrders);

    // 测试

    return {
      goodResult,
      badResult,
    };

  }

  // 查询现金流量表
  async queryCash() {
    const Cashflow = this.ctx.model.Cashflow;
    const query = await this.ctx.query;
    const result = await this.query(Cashflow, query);
    return result;
  }
}


module.exports = CashService;
