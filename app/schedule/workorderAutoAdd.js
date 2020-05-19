'use strict';

const Subscription = require('egg').Subscription;


class OrderStart extends Subscription {
  static get schedule() {
    return {
      interval: '60s',
      // cron: '*/15 * * * * *',
      type: 'all',
    };
  }

  async subscribe() {
    // await this.ctx.service.workorder.workorderAdd();
    // await this.ctx.service.workorder.workorderAutoAdd();
    // console.log(1);
  }
}

module.exports = OrderStart;
