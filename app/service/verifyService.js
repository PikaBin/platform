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
  async verifyCategory() {

    // 获取前端审核结果
    const AskCategory = await this.ctx.request.body;
    const result = AskCategory.Ask;
    const Category = this.ctx.model.Category;

    // 审核结果 通过
    if (result === '1') {

      // 更新品类原表的信息为申请表中的信息
      AskCategory.categoryState = result;
      const updateInfo = await Category.update({ categoryName: AskCategory.categoryName }, AskCategory);
      const find = await Category.find({ categoryName: AskCategory.categoryName });
      console.log(updateInfo, find);

      // 若没有变动，则显示更新失败
      if (updateInfo.nModefied === 0) {
        return {
          verify: '0',
          information: '数据库更新失败',
        };
      }
      // 返回更新成功
      return {
        verify: '1',
        information: '数据库更新成功',
      };

      // 审核结果 未通过
    } else if (result === '2') {
      const updateInfo = await Category.updateOne({ categoryName: AskCategory.categoryName }, { categoryReason: AskCategory.categoryReason });

      // 若没有变动，则显示更新失败
      if (updateInfo.nModefied === 0) {
        return {
          verify: '0',
        };
      }
      // 返回更新成功
      return {
        verify: '1',
      };
    }


  }

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
   */


}

module.exports = VerifyService;
