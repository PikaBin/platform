'use strict';

const Subscription = require('egg').Subscription;


class FlowCash extends Subscription {
  static get schedule() {
    return {
      interval: '10s',
      type: 'all',
    };
  }

  async subscribe() {

    // await this.ctx.service.flowcash.calculate();
    // console.log(1);
  }
}

module.exports = FlowCash;
