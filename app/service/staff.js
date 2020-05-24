/**
 * 用来存放关于平台员工的操作请求
 */
'use strict';

const Service = require('egg').Service;

class StaffService extends Service {

  // 添加员工
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

  // 更新信息
  async updateStaff() {
    const data = await this.ctx.request.body;
    const Staff = this.ctx.model.Staff;
    const staffId = await this.ctx.query.staffId;

    try {
      const updateResult = await Staff.updateOne({ _id: staffId }, data);
      const findResult = await Staff.findById(staffId);
      if (updateResult.nModified !== 0) {
        return {
          status: '1',
          information: '信息更新成功',
          findResult,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: '0',
        information: '更新失败',
        error: err.message,
      };
    }
  }

}

module.exports = StaffService;
