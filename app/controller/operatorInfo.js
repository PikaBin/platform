/* eslint-disable quotes */
/**
 * 运营商基础信息controller
 */
'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const pump = require('mz-modules/pump');
const path = require('path');
class OperatorInfoController extends Controller {

  /** 新增运营商 */
  async addOperator() {

    // 获取前端数据
    // const requestData = await this.ctx.request.body;
    // console.log('前端获取的数据：' + JSON.stringify(requestData));

    try {
      // 调用Service方法
      const operatorInstance = await this.service.operatorInfo.addOperator();
      // 对前端进行响应
      this.ctx.body = operatorInstance;
      this.ctx.status = 201;
    } catch (err) {
      console.log(err);
      this.ctx.body = "页面出现了未知错误";
    }

  }
  /**
   * 更新运营商基础信息并返回更新后的信息
   */
  async updateOperator() {
    // 获取前端数据
    const result = await this.ctx.service.operatorInfo.updateOperator();
    this.ctx.body = result;
  }

  /**
   * 查询运营商基础信息并返回
   */
  async queryOperator() {
    // 获取前端数据
    const result = await this.ctx.service.operatorInfo.queryOperator();
    this.ctx.body = result;
  }

  /**
   * 前端上传头像,保存图片的存储路径到数据库
   */
  async getPhoto() {
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

    // 将图片存储路径加入到相应运营商记录中
    // const id = this.ctx.query.id; // 暂时从前端通过query方式 传入用户id
    // const Operator = this.ctx.model.Operator;
    try {
      const result = await this.ctx.service.operatorInfo.updateOperator({ legalPersonPhoto: dir.saveDir });
      console.log('result:' + JSON.stringify(result));
    } catch (err) {
      console.log('operatorInfo错误：' + err);
    }


    this.ctx.body = {
      url: target,
      fields: stream.fields,
    };

  }

  // 新增运营商合约
  async addContract() {
    const result = await this.ctx.service.operatorInfo.addoperatorContract();
    this.ctx.body = result;
  }

  // 查询运营商合约
  async queryO_contract() {
    const result = await this.ctx.service.operatorInfo.queryO_contract();
    this.ctx.body = result;
  }
}

module.exports = OperatorInfoController;

