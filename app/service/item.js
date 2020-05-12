/**
 * 单品
 */
'use strict';

const { Service } = require('egg');

class ItemService extends Service {

  async addItem() {
    const Item = this.ctx.model.Item;
    const itemInstance = new Item(this.ctx.request.body);
    itemInstance.save(err => {
      if (err) {
        console.log('itemservice错误：' + err);
      }
    });
    return itemInstance;
  }

}
module.exports = ItemService;
