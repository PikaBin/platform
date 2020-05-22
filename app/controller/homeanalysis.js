/**
 * 首页数据分析
 */
'use strict';

const { Controller } = require('egg');

class HomeAnalysis extends Controller {
  async totalAmount() {
    const result = await this.ctx.service.homeAnalysis.salesVolume();
    this.ctx.body = result;
  }
}

module.exports = HomeAnalysis;
