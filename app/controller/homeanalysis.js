/**
 * 首页数据分析
 */
'use strict';

const { Controller } = require('egg');

class HomeAnalysis extends Controller {
  // 计算总销售额
  async totalAmount() {
    const result = await this.ctx.service.homeAnalysis.salesVolume();
    this.ctx.body = result;
  }

  // 计算销售额日比
  async onDay() {
    const result = await this.ctx.service.homeAnalysis.saleonDay();
    this.ctx.body = result;
  }

  // 本周销售额数据
  async orderOnmonth() {
    const result = await this.ctx.service.homeAnalysis.saleonMonth();
    this.ctx.body = result;
  }

  // 本年的销售额数据
  async orderOnyear() {
    const result = await this.ctx.service.homeAnalysis.saleonYear();
    this.ctx.body = result;
  }

  // 应收账款总额
  async profitVolume() {
    const result = await this.ctx.service.homeAnalysis.profitVolume();
    this.ctx.body = result;
  }

  // 成交量总额
  async orderVolume() {
    const result = await this.ctx.service.homeAnalysis.orderVolume();
    this.ctx.body = result;
  }

  // 日成交量与日增长比
  async orderOnday() {
    const result = await this.ctx.service.homeAnalysis.orderOnday();
    this.ctx.body = result;
  }

  // 本月每日成交量
  async orderOnMonth() {
    const result = await this.ctx.service.homeAnalysis.orderonMonth();
    this.ctx.body = result;
  }

  // 本年成交量
  async countOnYear() {
    const result = await this.ctx.service.homeAnalysis.countOnYear();
    this.ctx.body = result;
  }

  // 本月应收账款
  async profitonMonth() {
    const result = await this.ctx.service.homeAnalysis.profitOnMonth();
    this.ctx.body = result;
  }

  // 本年应收账款
  async profitOnYear() {
    const result = await this.ctx.service.homeAnalysis.profitOnYear();
    this.ctx.body = result;
  }

  // 应付账款总额
  async debtVolume() {
    const result = await this.ctx.service.homeAnalysis.debtVolume();
    this.ctx.body = result;
  }

  // 应付账款 本月
  async debtOnMonth() {
    const result = await this.ctx.service.homeAnalysis.debtOnMonth();
    this.ctx.body = result;
  }

  // 应付账款 本年
  async debtOnYear() {
    const result = await this.ctx.service.homeAnalysis.debtOnYear();
    this.ctx.body = result;
  }

  // 运营商排行榜
  async operatorRank() {
    const result = await this.ctx.service.homeAnalysis.operatorRank();
    this.ctx.body = result;
  }
  // 订单总量
  // async totalorder() {
  //   const result = await this.ctx.service.orderAnalysis.totalorder();
  //   this.ctx.body = result;
  // }

  // 每月订单
  // async ordersOnMonth() {
  //   const result = await this.ctx.service.orderAnalysis.orderOnMonth();
  //   this.ctx.body = result;
  // }

  // 本年订单
  // async orderOnYear() {
  //   const result = await this.ctx.service.orderAnalysis.orderOnYear();
  //   this.ctx.body = result;
  // }

  // 意外中止订单总数
  async badorder() {
    const result = await this.ctx.service.orderAnalysis.badorder();
    this.ctx.body = result;
  }

  // 意外中止 每月
  async badorderOnMonth() {
    const result = await this.ctx.service.orderAnalysis.badorderOnMonth();
    this.ctx.body = result;
  }

  // 顺利完成
  async goodorderOnMonth() {
    const result = await this.ctx.service.orderAnalysis.goodorderOnMonth();
    this.ctx.body = result;
  }

  // 单品排行榜
  async partitionRank() {
    const result = await this.ctx.service.orderAnalysis.partitionRank();
    this.ctx.body = result;
  }
}

module.exports = HomeAnalysis;
