/**
 * 品类标签控制器
 */
'use strict';

const { Controller } = require('egg');

class labelController extends Controller {

  // 新增品类标签
  async addLabel() {
    const { ctx, service } = this;
    // const labelData = await ctx.request.body;
    // console.log('labeldata:' + JSON.stringify(labelData));
    try {
      const labelInstance = await service.label.addLabel();
      ctx.status = 201;
      ctx.body = labelInstance;
    } catch (err) {
      console.log(err);
      ctx.body = '页面出现了未知错误';
    }
  }
}

module.exports = labelController;
