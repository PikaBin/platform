/**
 * 平台用户信息
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const staffSchema = new Schema({
    name: String, // 姓名
    joinTime: { type: Date, default: new Date() }, // 加入时间
    photo: { type: String }, // 用户头像
    account: { type: String, required: true }, // 账号
    password: { type: String, required: true }, // 密码
    deleteTime: { type: Date }, // 删除时间
    introduction: { type: String }, // 个人简介
    phone: { type: String }, // 联系电话
    email: { type: String }, // 邮箱地址
  });

  return mongoose.model('Staff', staffSchema);
};
