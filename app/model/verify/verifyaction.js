'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const categoryAdjustSchema = new Schema({
    categoryadjustID: { type: String, required: true }, // 品类调整表ID
    categoryID: { type: String, required: true }, // 品类ID
    auditorID: { type: String, required: true }, // 审核员ID
    Time: { type: Date, required: true }, // 时间
    Result: { type: String, required: true }, // 结果
    action: { type: String, required: true }, // 表明动作：0 - 添加；1 - 修改； 2 - 删除
  });

  return mongoose.model('CategoryAdjust', categoryAdjustSchema);
};
