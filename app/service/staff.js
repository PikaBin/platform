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

  // 修改密码
  async changePassword() {
    const data = await this.ctx.request.body;
    const Staff = this.ctx.model.Staff;
    const Operator = this.ctx.model.Operator;
    const character = await this.ctx.query.character;
    const id = await this.ctx.query._id;
    data.password = await this.ctx.service.tools.md5(data.password);
    const idO = await this.ctx.service.tools.getObjectId(id);
    // console.log(idO);

    // 判断什么角色
    if (character === 'o') {
      const update = await Operator.findByIdAndUpdate(idO, data);
      console.log('运营商：', update);
      if (update) {
        return {
          status: '1',
          information: '修改密码成功',
        };
      }
      return {
        status: '0',
        information: '修改失败',
      };
    }

    const update = await Staff.findByIdAndUpdate(idO, data);
    console.log('平台员工：', update);
    if (update.nModified !== 0) {
      return {
        status: '1',
        information: '修改密码成功',
      };
    }

    return '修改失败';
  }


}

module.exports = StaffService;
