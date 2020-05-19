/**
 * 审核
 */
'use strict';
const Controller = require('egg').Controller;
class VerifyController extends Controller {
  // 返回待审核品类申请的数量
  async verifyAmount() {
    const CAInstace = await this.ctx.service.verifyService.findNewCategory();
    const amount = CAInstace.amount;
    this.ctx.body = amount;
  }

  // 平台审核
  async verifyCategory() {
    const result = await this.ctx.service.verifyService.verifyCategory();
    this.ctx.body = result;
  }

  // 返回审核列表
  async queryAdjust() {
    const options = this.ctx.queries;
    const result = await this.ctx.service.verifyService.queryAdjust(options);
    this.ctx.body = result;
  }

  // 处理运营商申请
  async verifyOperator() {
    const result = await this.ctx.service.verifyService.verifyOperator();
    this.ctx.body = result;
  }

}

module.exports = VerifyController;
