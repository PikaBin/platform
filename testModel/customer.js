'use strict';
// module.exports = app => {
//   const mongoose = app.mongoose;
//   const Schema = mongoose.Schema;

//   const customerSchema = new Schema({
//     CustomerZhanghao: { type: String, required: true }, // 客户账号
//     Password: { type: String, required: true }, // 客户密码
//     CustomerName: { type: String, required: false }, // 客户名
//     CustomerID: { type: String, required: false }, // 客户ID
//     CustomerPhone: { type: String, required: false }, // 客户电话
//     CustomerEmail: { type: String, required: false }, // 客户邮箱
//     CustomerAdress: { type: String, required: false }, // 客户地址
//     CustomerRegistrationDate: { type: String, required: false }, // 客户注册时间
//     CustomerIDNo: { type: String, required: false }, // 客户身份证号
//     // name:String
//   });
//   return mongoose.model('customer', customerSchema);
// };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  CustomerZhanghao: { type: String, required: true }, // 客户账号
  Password: { type: String, required: true }, // 客户密码
  CustomerName: { type: String, required: false }, // 客户名
  CustomerID: { type: String, required: false }, // 客户ID
  CustomerPhone: { type: String, required: false }, // 客户电话
  CustomerEmail: { type: String, required: false }, // 客户邮箱
  CustomerAdress: { type: String, required: false }, // 客户地址
  CustomerRegistrationDate: { type: String, required: false }, // 客户注册时间
  CustomerIDNo: { type: String, required: false }, // 客户身份证号
  // name:String
});

module.exports = mongoose.model('Customer', customerSchema);
