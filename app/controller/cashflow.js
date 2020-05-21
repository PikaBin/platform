/**
 * 现金流控制器
 */
'use strict';
const { Controller } = require('egg');

class Cashflow extends Controller {

  // 查询现金流量表
  async queryCashflow() {
    const result = await this.ctx.service.flowcash.queryCash();
    this.ctx.body = result;
  }
}
module.exports = Cashflow;
