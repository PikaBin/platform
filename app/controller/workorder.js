/**
 * 工单控制
 */
'use strict';
const Controller = require('egg').Controller;

class workorderController extends Controller {

  // 发现新订单，并且返回给前端
  async findOrder() {
    try {
      const newOrder = await this.ctx.service.workorder.findUpdatedOrder();
      this.ctx.status = 200;
      this.ctx.body = newOrder;
    } catch (error) {
      console.log('findOrder控制层' + error);
    }
  }
  // 新增工单
  async workorderAdd() {
    try {
      const workorders = await this.ctx.service.workorder.workorderAdd();
      console.log('workorder内容：' + workorders);
      this.ctx.status = 200;
      this.ctx.body = workorders;
    } catch (err) {
      console.log('workorderController错误：' + err);
    }
  }
}
module.exports = workorderController;
