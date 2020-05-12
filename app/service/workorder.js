/* eslint-disable object-shorthand */
/* eslint-disable jsdoc/require-param */
/**
 * 工单service
 */
'use strict';

const Service = require('egg').Service;

class WorkorderService extends Service {

  // 检测新增的订单，
  /**
   * 通过比较最新一条记录的订单id是否大于上一次检测订单id来判断是否更新，如果更新，然后取出新增的订单记录
   * 没有更新，返回给前端null,
   */
  async findUpdatedOrder() {

    const Order = await this.ctx.model.Order;
    const FIRSTID = 202004010001; // 第一条订单id

    // 以此来判断是否最开始一次的查询，如果是那么就为第一个订单id，如果不是则为上一次查询id
    const oldID = this.ctx.session.orderId ? this.ctx.session.orderId : FIRSTID;

    // 获取最新订单的orderId
    const lastone = await Order.findOne().sort({ _id: -1 });
    const lastID = parseInt(lastone.orderId);

    // 判断是否更新，如果更新，则取出，并且更新oldID,
    if (oldID < lastID) {
      const newOrders = await Order.find({ orderId: { $gt: oldID } });
      this.ctx.session.orderId = lastID;
      return newOrders;
    }

  }
  // 新增工单，通过检测订单表的更新从而新增对应的工单
  async workorderAdd() {
    // console.log('body内容：' + JSON.stringify(this.ctx.request.body));
    const Workorder = this.ctx.model.Workorder;
    const newOrders = await this.findUpdatedOrder(); // 获取新增的订单
    const workorders = []; // 存放新增的工单，
    for (const order in newOrders) {
      const workorderInstance = new Workorder({
        // _id: 自动生成
        W_name: order.orderId,
        W_itemPartition: order.partitionId,
        orderID: order.orderId,
        W_operatorID: null,
        W_state: 2, // 由于是新生成的工单，所以工单状态默认为2(待分配)
        W_startTime: new Date(), // 此处有坑，mongodb数据库存入的时间会自动转化为零时区的时间，给以后的查询带来很大不便
        // W_endTime: ,这个应该是工单实际结束时间还是预期结束时间，
        W_serverTime: order.orderStartTime,
        requirement: order.remark,
        customerPhone: order.phone,
      });
      workorderInstance.save(err => {
        console.log('workorderService错误' + err);
      });
      workorders.push(workorderInstance);
    }

    return workorders;
  }

  /**
   * @param {JSON} badServicers 拒单的专才
   * 派发工单_get
   * 获取要派发的工单，通过匹配专才的可接项目，在接项目数量，在职状态，来确定一个可用专才列表，从而返回给前端
   */
  async assgin_get(badServicers) {

    const Servicer = this.ctx.model.Servicer;
    const Item = this.ctx.model.Item;
    const Order = this.ctx.model.Order;
    // 获取要派发的工单
    const workorder = await this.ctx.body.workorder;

    // 查询工单对应的item
    // const item = Workorder.find({_id: workorder._id})
    //               .populate('Order', 'itemId')
    //               .populate('Item','itemName');
    const itemID = await Order.findById(workorder.orderId, { itemId: 1, _id: 0 }); // 只返回itemId字段
    const itemname = await Item.findById(itemID, { _id: 0, itemName: 1 });


    // 查找符合条件的专才（在职状态为正常，在接项目小于最大可接项目数量，可接项目与工单上的一致
    // $in 操作符 表示servicerItem的元素 至少匹配itemname的一项
    const candidates = Servicer.aggregate([{ $match: { servicerStatus: '1', ordering: { $lt: '$MaxWorkeOrder' }, servicerItem: { $in: itemname } } }]);

    // 返回符合条件的专才，和已经拒单的专才(返回全部字段吗？)
    return {
      candidates: candidates,
      badServicers: badServicers,
    };

  }

  /**
   * 派发工单_post
   * 获取前端选择的专才，将工单信息与专才信息写入派单表中，
   * 问题；在这一步是否要更改工单的状态，默认状态是待分配，应该是等等专才确认后才改变，
   * 如果专才没有及时确认，专才端显示过期，运营商端要重新选择专才，从而派发，但是在返回的专才列表中，会加上已经拒单的专才，前端予以标注
   */
  async assign_post() {
    const workorder = await this.ctx.body.workorder; // 获取要派送的工单
    const servicer = await this.ctx.body.servicer; // 获取前端选中的专才

    // 向派单表中插入相关记录
    const Assgin = this.ctx.model.Assgin;
    const assginInstance = await new Assgin({
      // _id:
      workorderID: workorder._id,
      state: '0',
      servicerID: servicer.servicerId,
      endTime: null,
    });
    assginInstance.save(err => console.log(err + ' at assign_post of servicer'));

    // 更新派单表中的日志 未经测试
    Assgin.updateOne({ workorderID: workorder._id }, { $push: { log: { time: Date.now(), servicer: servicer.servicerId } } });
  }

  // 检测专才是否及时确认工单，
  // 获取工单派送给专才的时间，然后对该工单循环以下操作：过规定的时间（例如10分钟）后，检测该工单状态是否改变，
  // 若变，则结束循环，

}

module.exports = WorkorderService;
