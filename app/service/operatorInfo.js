'use strict';
/**
 * 用途：负责运营商基础信息维护
 * 具体功能：
 * 1.新增运营商
 * 2.更新运营商信息
 * 3.查询运营商信息
 * 4.删除运营商信息（应该是平台拥有的功能）
 */

const { Service } = require('egg');

class OperatorInfo extends Service {

  /** 新增运营商  */
  async addOperator() {
    const Operator = await this.ctx.model.Operator;
    const req = this.ctx.request.body;
    req.password = (await this.ctx.service.tools.md5(req.password)).toString();
    console.log('password是什么类型' + typeof (req.password));
    const operatorInstance = new Operator(req);
    operatorInstance.save(err => {
      if (err) {
        console.log(err);
        return;
      }
    });

    return operatorInstance;

  }
  /**
   * 更新前端数据应该分为两步，第一步展示原有的信息表单，前端进行修改完成，提交，第二步，后端更新数据库信息，重新定位到运营商信息页面
   * @param  {Object} data 参数 为要修改的 Json格式的数据
   */
  async updateOperator(data) {
    const Operator = await this.ctx.model.Operator;
    // eslint-disable-next-line no-unused-vars
    const temp = await Operator.findByIdAndUpdate(this.ctx.query._id, data); // 此处返回的记录为修改前的记录值
    const updatedData = Operator.findById(this.ctx.query._id);
    // console.log('"更新"后的数据' + JSON.stringify(data));
    return updatedData;

  }
  /**
  * 此处有个问题，如果查询没有得到结果，前端只会得到一个created的值；现在进行初步改进，加一个if判断；
  */
  async queryOperator() {
    const query = await this.ctx.query;
    const Operator = this.ctx.model.Operator;
    const foundData = await Operator.find(query);
    if (foundData.length !== 0) {
      return {
        information: '查询成功',
        status: '1',
        foundData,
      };
    }
    return {
      information: '查询成功，但是没有对应的运营商',
      status: '0',
    }
  }


}

module.exports = OperatorInfo;
