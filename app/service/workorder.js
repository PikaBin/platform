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


    // 判断是否更新，如果更新，则取出，并且更新session,
    if (oldID < lastID) {
      const newOrders = await Order.find({ orderId: { $gt: oldID } }).limit(2); // 为了测试,进行限制
      this.ctx.session.orderId = lastID;
      return newOrders;
    }

    return {
      information: '无新增订单',
    };

  }
  // 新增工单，通过检测订单表的更新从而新增对应的工单
  async workorderAdd() {

    const Workorder = this.ctx.model.Workorder;
    const newOrders = await this.findUpdatedOrder(); // 获取新增的订单
    // console.log('获取的新的订单是什么样的：' + newOrders.length);
    if (newOrders.length !== undefined) {

      const workorders = []; // 存放新增的工单
      try {
        for (let i = 0; i < newOrders.length; i++) {
          const order = newOrders[i];
          // console.log('每一个订单' + order);

          // 查询单品分区对应的运营商，
          const Partition = this.ctx.model.Partition;
          const Category = this.ctx.model.Category;
          const partition = await Partition.findById(order.partitionId).populate('itemID');
          // console.log('单品是：' + partition);
          const categoryInstance = await Category.findById(partition.itemID.categoryID);
          // console.log('运营商是：' + categoryInstance);
          const workorderInstance = await Workorder.create({
            name: order.orderId,
            itemPartition: order.partitionId,
            orderID: order._id,
            operatorID: categoryInstance.categoryOperator,
            state: '2', // 由于是新生成的工单，所以工单状态默认为2(待分配)
            startTime: new Date(), // 此处有坑，mongodb数据库存入的时间会自动转化为零时区的时间，但是前端显示会自动转为本地时间
            requirement: order.remark,
            customerPhone: order.phone,
          });
          workorders.push(workorderInstance);
        }
        return workorders;
      } catch (err) {
        console.log(err);
        return {
          information: '转单出错',
          status: '0',
          error: err.message,
        };
      }
    }

    // 如果没有新增订单
    return {
      information: '无新增订单',
      status: '2',
    };

  }

  /**
   * 根据订单状态自动生成工单
   */
  async workorderAutoAdd() {
    const Order = this.ctx.model.Order;
    const Partition = this.ctx.model.Partition;
    // const Category = this.ctx.model.Category;
    const Operator = this.ctx.model.Operator;
    const Workorder = this.ctx.model.Workorder;
    const CashFlow = this.ctx.model.Cashflow;

    // 查询未生成工单 的订单
    const newOrders = await Order.find({ orderState: '0' });

    // 如果有这样的订单存在
    if (newOrders.length !== 0) {

      const workorders = []; // 存放新增的工单
      try {
        for (let i = 0; i < newOrders.length; i++) {
          const order = newOrders[i];
          // console.log('每一个订单' + order);

          // 查询单品分区对应的运营商，
          const partition = await Partition.findById(order.partitionId).populate('itemID');
          console.log('单品是：' + partition);
          // const categoryInstance = await Category.findById(partition.itemID.categoryID);
          // const itemInstance = await Operator.findById(partition.itemID._id);
          // console.log('运营商是：' + itemInstance);

          // 创建对应的工单
          const workorderInstance = await Workorder.create({
            name: order.orderId,
            itemPartition: order.partitionId,
            orderID: order._id,
            operatorID: partition.itemID.operatorID,
            state: '2', // 由于是新生成的工单，所以工单状态默认为2(待分配)
            startTime: new Date(), // 此处有坑，mongodb数据库存入的时间会自动转化为零时区的时间，但是前端显示会自动转为本地时间
            requirement: order.remark,
            customerPhone: order.phone,
          });
          workorders.push(workorderInstance);

          // 改变订单的状态为已生成工单 ('1')
          // eslint-disable-next-line no-unused-vars
          const updateState = await Order.updateOne({ _id: order._id }, { orderState: '1' });
          // console.log('生成工单后的订单状态' + order._id + updateState.nModified);

          // 完善现金流量表内容（工单id）
          // console.log(order._id);
          const workorderTocash = await CashFlow.updateOne({ orderId: order._id }, { workOrderId: workorderInstance._id, addTime: new Date() });
          console.log('添加了吗：' + JSON.stringify(workorderTocash));
        }

        return workorders;
      } catch (err) {
        console.log(err);
        return {
          information: '转单出错',
          status: '0',
          error: err.message,
        };
      }
    }
  }

}

module.exports = WorkorderService;
