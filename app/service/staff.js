/**
 * 用来存放关于平台员工的操作请求
 */
'use strict';

const Service = require('egg').Service;

class StaffService extends Service {

  async addstaff() {
    const data = await this.ctx.request.body;
    const Staff = this.ctx.model.Staff;

    try {
      data.password = await this.service.tools.md5(data.password);
      const createResult = await Staff.create(data);
      return {
        status: '1',
        information: '新增成功',
        createResult,
      };
    } catch (err) {
      console.log('service/addstaff' + err);
      return {
        status: '0',
        information: '新增失败',
        error: err.message,
      };
    }
  }
}

module.exports = StaffService;
