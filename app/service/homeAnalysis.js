'use strict';
/**
 * 平台首页 数据分析
 */
const { Service } = require('egg');

class HomeAnalysis extends Service {

  async salesVolume() {
    const Order = this.ctx.model.Order;
  }
}

module.exports = HomeAnalysis;
