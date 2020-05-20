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

  // 通用query方法
  async query(model, query) {
    try {
      const findResult = await model.find(query);

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功，但是结果为空',
        status: '0',
      };

    } catch (err) {
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }

  }

  /** 新增运营商  */
  async addOperator() {
    const Operator = await this.ctx.model.Operator;
    const req = this.ctx.request.body;
    req.password = (await this.ctx.service.tools.md5(req.password)).toString();
    console.log('password是什么类型' + typeof (req.password));
    const operatorInstance = new Operator(req);
    await operatorInstance.save();

    return operatorInstance;

  }
  /**
   * 修改运营商
   */
  async updateOperator() {
    const Operator = await this.ctx.model.Operator;
    const data = await this.ctx.request.body;
    const temp = await Operator.updateOne(this.ctx.query._id, data); // 此处返回的记录为修改前的记录值

    if (temp.nModified !== 0) {
      const updatedData = await Operator.findById(this.ctx.query._id);
      // console.log('"更新"后的数据' + JSON.stringify(data));
      return {
        information: '修改成功',
        status: '1',
        updatedData,
      };
    }

    return {
      information: '操作成功，但没有产生修改',
      status: '2',
    };

  }
  /**
  * 查询列表
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

    // 查询为空
    return {
      information: '查询成功，但是没有对应的运营商',
      status: '0',
    };
  }

  // 新增运营商合约
  async addoperatorContract() {
    const OperatorContract = this.ctx.model.Operatorcontract;
    const body = await this.ctx.request.body;

    try {
      const addResult = await OperatorContract.create(body);

      if (addResult) {
        return {
          information: '添加合约成功',
          status: '1',
          addResult,
        };
      }

      // 添加为空
      return {
        information: '添加合约失败',
        status: '0',
      };
    } catch (err) {
      console.log('addContact: ', err);
      return {
        information: '添加合约失败',
        status: '0',
        error: err.message,
      };
    }
  }

  // 查询合约
  async queryO_contract() {
    const OperatorContract = this.ctx.model.Operatorcontract;
    const query = await this.ctx.query;
    const findResult = await this.query(OperatorContract, query);
    return findResult;
  }


}

module.exports = OperatorInfo;
