/* eslint-disable jsdoc/require-param */
/* eslint-disable no-unused-vars */
/**
 * 先实现单文件上传，
 * 注意事项：只支持单文件上传，而且上传的文件必须放在表单最后的字段
 */
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
// const sendToWormhole = require('stream-wormhole');
const mkdirp = require('mz-modules/mkdirp');
// const sillyTime = require('silly-datetime');
class UploadSingle extends Controller {

  /**
   *  文件名称
   * 上传用户头像，写入数据库图片路径，并且将图片路径返回给前端
   */
  async makeUploadPath(filename) {
    // // 获取当前日期
    // const day = sillyTime.format(new Date(), 'YYYYMMDD');
    // // 创建图片保存路径
    // const dir = path.join(this.config.upload, day);
    await mkdirp(this.config.upload);
    // 毫秒数
    const time = await new Date().getTime();
    // 返回图片保存的路径
    const uploadDir = path.join(this.config.upload, time + path.extname(filename));
    return {
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'), // 从0开始选取，将\\ 替换为 \
      uploadDir,
    };
  }
}
module.exports = UploadSingle;

