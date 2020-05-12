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

  // 查询员工详细信息
  async queryStaff() {
    const Staff = this.ctx.model.Staff;
    try {
      // console.log(this.ctx.query._id);
      const result = await Staff.findById(this.ctx.query._id);
      // console.log(result);
      if (result) {
        this.ctx.body = {
          status: '1',
          information: '查询成功',
          result,
        };
      } else {
        this.ctx.body = {
          status: '2',
          information: '查询没有此内容',
        };
      }


    } catch (err) {
      console.log('service/staff/' + err);
      this.ctx.body = {
        status: '0',
        information: '查询失败',
        error: err.message,
      };
    }
  }
}

module.exports = StaffController;
