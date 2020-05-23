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

  /**
   * 根据query查单品
   */
  async queryByItem() {
    const query = await this.ctx.request.query;
    // query._id = await this.ctx.service.tools.getObjectId(query._id);
    console.log('query' + JSON.stringify(query));
    const Item = this.ctx.model.Item;
    const findResult = await Item.aggregate([{ $match: query },
      { $lookup: {
        from: 'partitions',
        localField: '_id',
        foreignField: 'itemID',
        as: 'partition',
      } }, {
        $lookup: {
          from: 'interrupts',
          localField: '_id',
          foreignField: 'itemId',
          as: 'interrupt',
        },
      }]);
    return findResult;
  }

}
module.exports = ItemService;
