/**
 * 单品控制器
 */
'use strict';
const { Controller } = require('egg');
class itemController extends Controller {

  async addItem() {
    try {
      const itemInstance = await this.ctx.service.item.addItem();
      this.ctx.status = 200;
      this.ctx.body = itemInstance;
    } catch (err) {
      console.log('itemController error：' + err);
    }


  }
}

module.exports = itemController;
