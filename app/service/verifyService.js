/**
 * 平台端用来审核各种申请
 */
'use strict';
const Service = require('egg').Service;
class VerifyService extends Service {

  /**
   * 通用审核方法
   * @param {Model} target 处理对象model
   * @param {ObjectId} adjustId 对应的申请记录id
   * @param {String}  detailO 具体对象标志
   */
  async verify(target, adjustId, detailO) {
    const Staff = this.ctx.model.Staff; // 发送者model
    const News = this.ctx.model.Verify.News;
    // const Category = this.ctx.model.Category; // 处理对象model

    const Adjust = this.ctx.model.Verify.Adjust; // 调整表

    const origin = await Adjust.findById(adjustId); // 获取原始申请表里的申请记录
    // console.log(origin);
    const adjustInstance = await this.ctx.request.body; // 获取审核后完善的数据
    try {

      // 若更新成功，判断是否审核通过,并根据不同的结果进行不同的处理，1表示审核通过
      let result; // 存放 执行操作结果
      if (adjustInstance.auditStatus === '1') {

        // 审核通过，执行申请的操作(但是没有catch 错误)
        // console.log('id：' + origin.objectId);
        switch (origin.action) {

          case '1': {
            result = await target.updateOne({ _id: origin.objectId }, origin.changedData); // 修改
            console.log('到底更新了什么：' + origin.changedData);
            await target.updateOne({ _id: origin.objectId }, { verifyTime: new Date(), examineTF: '1' });
            break;
          }
          case '2': {
            result = await target.deleteOne({ _id: origin.objectId }); // 删除
            break;
          }
          case '3': {
            result = await target.updateOne({ _id: origin.objectId }, { categorystate: '1' }); // 上架
            await target.updateOne({ _id: origin.objectId }, { verifyTime: new Date(), examineTF: '1' });
            break;
          }
          case '4': {
            result = await target.updateOne({ _id: origin.objectId }, { categorystate: '0' }); // 下架
            break;
          }
          default: {
            result = null;
            break;
          }
        }
        console.log('做出的动作是什么呢？' + origin.action, result);

      }


      // 判断执行条件
      // 审核通过操作成功或者前端审核未通过，
      if (result || adjustInstance.auditStatus === '2') {

        // 更改申请表记录，插入审核人，审核时间，改变审核状态
        let changeAdjust = {};
        const updateResult = await Adjust.updateOne({ _id: adjustId }, adjustInstance);
        // console.log(updateResult);
        if (updateResult.nModified === 0) {
          changeAdjust = {
            status: '0',
            information: '申请表没有更新,审核失败或者 审核不通过',
          };
        } else {
          changeAdjust = {
            status: '1',
            information: '申请表已更新,审核成功',
          };
        }

        // 发送运营商消息
        const auditor = await Staff.findById(adjustInstance.auditorID, { name: 1 });
        // console.log('name: ' + auditor.name);
        const newsInstance = await News.create({
          receiveId: origin.operatorId, // 消息接受对象的id
          senderId: adjustInstance.auditorID, // 发送方id
          auditorName: auditor.name, // 发送消息者姓名
          object: 'p', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
          action: 'q', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
          detailObject: detailO, // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
          detailObjectId: origin.objectId, // 具体处理对象id
          result: adjustInstance.auditStatus, // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
          timestamp: Date.now(),
          verifiedData: adjustInstance, // 存放相关中间表字段
        });

        // 返回结果
        return {
          status: '1',
          information: '操作数据库成功,审核成功',
          newsInstance, // 发送的消息
          changeAdjust, // 更改申请表的结果
        };
      }

      // 如果审核失败
      return {
        status: '0',
        information: '操作数据库失败,审核失败',
      };

    } catch (err) {
      console.log('/verifyservice/verifyCategory', err);
      return {
        status: '0',
        information: '审核出错',
        error: err.message,
      };
    }
  }

  // 发现是否有记录
  async findNewCategory() {
    const CategoryAsk = await this.ctx.model.CategoryAsk;

    // 假设第一条订单时间戳为0
    const FIRST = 0;

    // 以此来判断是否最开始一次的查询，如果是那么就为第一个订单id，如果不是则为上一次查询id
    const old = this.ctx.session.last ? this.ctx.session.last : FIRST;

    // 获取最新订单的categoryId
    const latestone = await CategoryAsk.findOne().sort({ _id: -1 }); // id为索引排序，从旧到新排列
    const latest = latestone.timestamp;
    console.log('old:' + old, 'latest:' + latest);
    if (old < latest) {
      const newCategoryAsk = await CategoryAsk.find({ timestamp: { $gt: old } });
      // console.log('类型是：' + typeof (newCategoryAsk));
      this.ctx.session.last = latest;
      console.log('新增品类申请' + newCategoryAsk);

      // 返回新增的记录内容以及新增的数量
      return {
        newCategoryAsk,
        amount: newCategoryAsk.length, // 待审核的数量
      };
    }
    // 若没有新增，就返回0
    return {
      amount: 0,
    };
  }

  /**
   * 平台审核
   * 若通过，将申请表信息替换为原有信息，状态码改为已审核
   * 若不通过，填写理由（从前端获取），状态码不变
   * 审核状态码：0为审核中，1为审核的结果为通过，2为审核未通过，默认为0
   * 审核操作：0为审核失败，1为审核成功
   */

  /**
   * 查询审核申请列表 审核get
   * @param {JSON} options 用来过滤列表的参数
   *  */
  async queryAdjust(options) {
    const Adjust = await this.ctx.model.Verify.Adjust;

    try {
      const findResult = await Adjust.find(options).sort({ applyTime: -1 });

      // 判断是否有内容
      if (findResult.length !== 0) {
        return {
          status: '1',
          information: '查询成功',
          findResult,
        };
      }

      return {
        status: '3', // 表明操作成功了，但是没有要查的内容
        information: '查无结果，数据库中没有相关信息',
      };
    } catch (err) {
      console.log('err信息:' + err);
      return {
        status: '1',
        information: '查询失败',
        error: err.message,
      };
    }

  }

  /**
   * 处理品类 提交的审核
   * 主要改动有以下两点：首先，改变数据：改变审核状态，插入审核时间，审核人；做出申请动作，例如删除，修改
   * 其次，发送运营商消息，通知运营商;
   * 前端发送 申请id,审核时的数据
   */
  async verifyCategory() {
    const Staff = this.ctx.model.Staff;
    const News = this.ctx.model.Verify.News;
    const Category = this.ctx.model.Category;
    const Adjust = this.ctx.model.Verify.Adjust;
    const id = this.ctx.query._id; // 获取申请记录的id
    // console.log(id);
    const origin = await Adjust.findById(id); // 获取原始申请表里的申请记录
    // console.log(origin);
    const adjustInstance = await this.ctx.request.body; // 获取审核后完善的数据
    try {

      // 若更新成功，判断是否审核通过,并根据不同的结果进行不同的处理，1表示审核通过
      let result; // 存放 执行操作结果
      if (adjustInstance.auditStatus === '1') {

        // 审核通过，执行申请的操作(但是没有catch 错误)
        // eslint-disable-next-line no-unused-vars
        // console.log('id：' + origin.objectId);
        switch (origin.action) {

          case '1': {
            result = await Category.updateOne({ _id: origin.objectId }, origin.changedData); // 修改
            console.log('到底更新了什么：' + origin.changedData);
            await Category.updateOne({ _id: origin.objectId }, { categoryverifyTime: new Date(), categoryExamineTF: '1' });
            break;
          }
          case '2': {
            result = await Category.deleteOne({ _id: origin.objectId }); // 删除
            break;
          }
          case '3': {
            result = await Category.updateOne({ _id: origin.objectId }, { categoryState: '1' }); // 上架
            break;
          }
          case '4': {
            result = await Category.updateOne({ _id: origin.objectId }, { categoryState: '0' }); // 下架
            break;
          }
          default: {
            result = null;
            break;
          }
        }
        console.log('做出的动作是什么呢？' + origin.action, result);

      }


      // 判断执行条件
      // 审核通过操作成功或者前端审核未通过，
      if (result || adjustInstance.auditStatus === '2') {

        // 更改申请表记录，插入审核人，审核时间，改变审核状态
        let changeAdjust = {};
        const updateResult = await Adjust.updateOne({ _id: id }, adjustInstance);
        // console.log(updateResult);
        if (updateResult.nModified === 0) {
          changeAdjust = {
            status: '0',
            information: '申请表没有更新,审核失败',
          };
        } else {
          changeAdjust = {
            status: '1',
            information: '申请表已更新,审核成功',
          };
        }

        // 发送运营商消息
        const auditor = await Staff.findById(adjustInstance.auditorID, { name: 1 });
        // console.log('name: ' + auditor.name);
        const newsInstance = await News.create({
          receiveId: origin.operatorId, // 消息接受对象的id
          senderId: adjustInstance.auditorID, // 发送方id
          auditorName: auditor.name, // 发送消息者姓名
          object: 'p', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
          action: 'q', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
          detailObject: 'c', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
          detailObjectId: origin.objectId, // 具体处理对象id
          result: adjustInstance.result, // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
          timestamp: Date.now(),
          verifiedData: adjustInstance, // 存放相关中间表字段
        });

        // 返回结果
        return {
          status: '1',
          information: '操作数据库成功,审核成功',
          newsInstance, // 发送的消息
          changeAdjust, // 更改申请表的结果
        };
      }

      // 如果审核失败
      return {
        status: '0',
        information: '操作数据库失败,审核失败',
      };

    } catch (err) {
      console.log('/verifyservice/verifyCategory', err);
      return {
        status: '0',
        information: '审核出错',
        error: err.message,
      };
    }
  }

  /**
   * 运营商审核
   */
  async verifyOperator() {
    const Operator = this.ctx.model.Operator;
    const adjustId = this.ctx.query.adjustId;
    const detailO = 'o';
    const verifyResult = await this.verify(Operator, adjustId, detailO);
    return verifyResult;
  }

  /**
   * 单品上下架审核
   */
  async verifyItem() {
    const Item = this.ctx.model.Item;
    const adjustId = this.ctx.query.adjustId;
    const detailO = 'I';

    // 具体处理单品审核
    const Staff = this.ctx.model.Staff; // 发送者model
    const News = this.ctx.model.Verify.News;
    // const Category = this.ctx.model.Category; // 处理对象model

    const Adjust = this.ctx.model.Verify.Adjust; // 调整表

    const origin = await Adjust.findById(adjustId); // 获取原始申请表里的申请记录
    // console.log(origin);
    const adjustInstance = await this.ctx.request.body; // 获取审核后完善的数据
    try {

      // 若更新成功，判断是否审核通过,并根据不同的结果进行不同的处理，1表示审核通过
      let result; // 存放 执行操作结果
      if (adjustInstance.auditStatus === '1') {

        // 审核通过，执行申请的操作(但是没有catch 错误)
        // console.log('id：' + origin.objectId);
        switch (origin.action) {

          case '1': {
            result = await Item.updateOne({ _id: origin.objectId }, origin.changedData); // 修改
            console.log('到底更新了什么：' + origin.changedData);
            await Item.updateOne({ _id: origin.objectId }, { verifyTime: new Date(), examineTF: '1' });
            break;
          }
          case '2': {
            result = await Item.deleteOne({ _id: origin.objectId }); // 删除
            break;
          }
          case '3': {
            result = await Item.updateOne({ _id: origin.objectId }, { itemState: '1', VerifyTime: new Date(), examineTF: '1' }); // 上架
            const examine = await Item.updateOne({ _id: origin.objectId }, origin.changedData);
            console.log('是否审核：', examine);
            break;
          }
          case '4': {
            result = await Item.updateOne({ _id: origin.objectId }, { itemState: '0' }); // 下架
            break;
          }
          default: {
            result = null;
            break;
          }
        }
        console.log('做出的动作是什么呢？' + origin.action, result);

      }


      // 判断执行条件
      // 审核通过操作成功或者前端审核未通过，
      if (result || adjustInstance.auditStatus === '2') {

        // 更改申请表记录，插入审核人，审核时间，改变审核状态
        let changeAdjust = {};
        const updateResult = await Adjust.updateOne({ _id: adjustId }, adjustInstance);
        // console.log(updateResult);
        if (updateResult.nModified === 0) {
          changeAdjust = {
            status: '0',
            information: '申请表没有更新,审核失败或者 审核不通过',
          };
        } else {
          changeAdjust = {
            status: '1',
            information: '申请表已更新,审核成功',
          };
        }

        // 发送运营商消息
        const auditor = await Staff.findById(adjustInstance.auditorID, { name: 1 });
        // console.log('name: ' + auditor.name);
        const newsInstance = await News.create({
          receiveId: origin.operatorId, // 消息接受对象的id
          senderId: adjustInstance.auditorID, // 发送方id
          auditorName: auditor.name, // 发送消息者姓名
          object: 'p', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
          action: 'q', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
          detailObject: detailO, // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
          detailObjectId: origin.objectId, // 具体处理对象id
          result: adjustInstance.auditStatus, // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
          timestamp: Date.now(),
          verifiedData: adjustInstance, // 存放相关中间表字段
        });

        // 返回结果
        return {
          status: '1',
          information: '操作数据库成功,审核成功',
          newsInstance, // 发送的消息
          changeAdjust, // 更改申请表的结果
        };
      }

      // 如果审核失败
      return {
        status: '0',
        information: '操作数据库失败,审核失败',
      };

    } catch (err) {
      console.log('/verifyservice/verifyCategory', err);
      return {
        status: '0',
        information: '审核出错',
        error: err.message,
      };
    }
  }


}

module.exports = VerifyService;
