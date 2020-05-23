/**
 * 首页数据分析
 */
'use strict';

const { Controller } = require('egg');

class HomeAnalysis extends Controller {
  // 计算总额
  async totalAmount() {
    const result = await this.ctx.service.homeAnalysis.salesVolume();
    this.ctx.body = result;
  }

  // 计算日比
  async onDay() {
    const result = await this.ctx.service.homeAnalysis.onDay();
    this.ctx.body = result;
  }
}

module.exports = HomeAnalysis;
