/**
 * 平台端用来审核各种申请
 */
'use strict';
const Service = require('egg').Service;
class VerifyService extends Service {

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
  // async verifyCategory() {

  //   // 获取前端审核结果
  //   const AskCategory = await this.ctx.request.body;
  //   const result = AskCategory.Ask;
  //   const Category = this.ctx.model.Category;

  //   // 审核结果 通过
  //   if (result === '1') {

  //     // 更新品类原表的信息为申请表中的信息
  //     AskCategory.categoryState = result;
  //     const updateInfo = await Category.update({ categoryName: AskCategory.categoryName }, AskCategory);
  //     const find = await Category.find({ categoryName: AskCategory.categoryName });
  //     console.log(updateInfo, find);

  //     // 若没有变动，则显示更新失败
  //     if (updateInfo.nModefied === 0) {
  //       return {
  //         verify: '0',
  //         information: '数据库更新失败',
  //       };
  //     }
  //     // 返回更新成功
  //     return {
  //       verify: '1',
  //       information: '数据库更新成功',
  //     };

  //     // 审核结果 未通过
  //   } else if (result === '2') {
  //     const updateInfo = await Category.updateOne({ categoryName: AskCategory.categoryName }, { categoryReason: AskCategory.categoryReason });

  //     // 若没有变动，则显示更新失败
  //     if (updateInfo.nModefied === 0) {
  //       return {
  //         verify: '0',
  //       };
  //     }
  //     // 返回更新成功
  //     return {
  //       verify: '1',
  //     };
  //   }

  // }

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
   * 前端发送 申请id,
   */
  async verifyCategory() {
    const Staff = this.ctx.model.Staff;
    const News = this.ctx.model.Verify.News;
    const Category = this.ctx.model.Category;
    const Adjust = this.ctx.model.Verify.Adjust;
    const id = this.ctx.query._id; // 获取申请的id
    const origin = await Adjust.findById(id); // 获取原始申请表里的申请记录
    // console.log(origin);
    const adjustInstance = await this.ctx.request.body; // 获取审核后完善的数据
    try {

      // 若更新成功，判断是否审核通过,并根据不同的结果进行不同的处理，1表示审核通过
      let result; // 存放 执行操作结果
      if (adjustInstance.auditStatus === '1') {

        // 审核通过，执行申请的操作(但是没有catch 错误)
        // eslint-disable-next-line no-unused-vars

        switch (origin.action) {
          // 品类新增不用审核
          // case '0': {
          //   result = await Category.create(origin.changedData);
          //   break;
          // }
          case '1': {
            result = await Category.updateOne({ _id: origin.objectId }, origin.changedData); // 修改
            console.log('到底更新了什么：' + origin.changedData);
            await Category.updateOne({ _id: origin.objectId }, { categoryverifyTime: new Date() });
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
      // 审核通过，操作也通过或者前端审核未通过，
      if (result || adjustInstance.auditStatus === '2') {

        // 更改申请表记录，插入审核人，审核时间，改变审核状态
        let changeAdjust = {};
        const updateResult = await Adjust.updateOne({ _id: id }, adjustInstance);
        console.log(updateResult);
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
          reason: adjustInstance.reason, // 审核 理由
          auditorName: auditor.name, // 审核人姓名
          auditTime: adjustInstance.auditTime, // 审核时间
          result: adjustInstance.auditStatus, // 审核结果
          timestamp: Date.now(), // 时间戳，
          verifiedData: origin.changedData, // 暂时用原始申请的附属数据替代，其实二者应该一致
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
   * 单品审核
   */


}

module.exports = VerifyService;
