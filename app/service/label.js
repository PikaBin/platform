/**
 * 品类标签，设计，营销,
 * 审核功能：运营商端申请创建，写入数据库，审核状态码为0，平台端审核，审核状态码为1，
 * 如果没有审核成功的话，运营商端不会显示，不能操作，更不能新增品类下的单品
 */
'use strict';
const { Service } = require('egg');

class LabelService extends Service {
  // 新增标签
  async addLabel() {
    const Label = this.ctx.model.Label;
    const labelInstance = new Label(this.ctx.request.body);
    labelInstance.save(err => {
      if (err) {
        console.log('service 层错误是：' + err);
        return;
      }
    });
    return labelInstance;
  }

}
module.exports = LabelService;
