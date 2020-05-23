/**
 * 单品控制器
 */
'use strict';
const { Controller } = require('egg');
class itemController extends Controller {

  // 增加单品
  async addItem() {
    try {
      const itemInstance = await this.ctx.service.item.addItem();
      this.ctx.status = 200;
      this.ctx.body = itemInstance;
    } catch (err) {
      console.log('itemController error：' + err);
    }
  }

  // 查询单品详情
  async queryItem() {
    const result = await this.ctx.service.item.queryByItem();
    this.ctx.body = result;
  }

  // 查询单品列表
  async listItem() {
    const Item = this.ctx.model.Item;

    // 查询
    const findResult = await Item.find();

    // 返回
    this.ctx.body = findResult;
  }
}

module.exports = itemController;
