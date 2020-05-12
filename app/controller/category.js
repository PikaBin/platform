/**
 * 品类
 */
'use strict';

const { Controller } = require('egg');
class categoryController extends Controller {

  // 新增品类
  async addCategry() {
    // const { ctx, service } = this;
    const data = this.ctx.request.body;
    try {
      if (this.ctx.session.userinfo) {
        const categoryInstance = await this.service.category.addCategory(data);
        this.ctx.status = 201;
        this.ctx.body = categoryInstance;
      } else {
        this.ctx.body = '未登录';
      }

    } catch (err) {
      console.log(err);
      this.ctx.body = '出现了未知错误';
    }


  }

  // 修改品类
  async updateCategory_O() {
    const req = await this.ctx.request.body;
    const CAinstance = await this.ctx.service.category.updateCategory_O(req);
    this.ctx.body = CAinstance;
    console.log(JSON.stringify(CAinstance));
  }
}

module.exports = categoryController;
