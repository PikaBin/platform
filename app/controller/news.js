/**
 * 现金流控制器
 */
'use strict';
const { Controller } = require('egg');

class Newscontroller extends Controller {

  // 接受消息
  async getNews() {
    const result = await this.ctx.service.news.getNews();
    this.ctx.body = result;
  }

  // 消息状态改变
  async setRead() {
    const result = await this.ctx.service.news.setRead();
    this.ctx.body = result;
  }
}
module.exports = Newscontroller;
