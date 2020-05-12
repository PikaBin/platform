'use strict';
/**
 * 处理平台员工请求
 */


const Controller = require('egg').Controller;
class StaffController extends Controller {

  async addStaff() {
    const result = await this.ctx.service.staff.addstaff();
    this.ctx.body = result;
  }
}

module.exports = StaffController;
