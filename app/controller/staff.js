'use strict';
/**
 * 处理平台员工请求
 */

const fs = require('fs');
const pump = require('mz-modules/pump');
const path = require('path');
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

  // 更改员工信息
  async updateStaff() {
    const result = await this.ctx.service.staff.updateStaff();
    this.ctx.body = result;
  }

  /**
   * 前端上传头像,保存图片的存储路径到数据库
   */
  async addPhoto() {
    // 获取表单提交的文件流
    const stream = await this.ctx.getFileStream();
    // 获取上传的文件名
    const filename = path.basename(stream.filename);
    // console.log(filename);nian.jpg

    // 拼接图片上传的目录
    const dir = await this.service.fileupload.makeUploadPath(filename);

    // 创建一个写入流
    const target = dir.uploadDir;
    console.log('target是' + target);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);

    // 将图片存储路径加入到相应员工记录中
    const Staff = this.ctx.model.Staff;
    try {
      const result = await Staff.updateOne({ _id: this.ctx.query.staffId }, { photo: dir.saveDir });
      console.log('result:' + JSON.stringify(result));
    } catch (err) {
      console.log('operatorInfo错误：' + err);
    }


    this.ctx.body = {
      url: target,
    };

  }
}

module.exports = StaffController;
