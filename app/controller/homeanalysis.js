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
}

module.exports = HomeAnalysis;
