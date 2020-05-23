
'use strict';
console.log('本脚本用来向数据库填充项目测试数据，');
const mongoose = require('mongoose');
const async = require('async');

// 连接数据库
// 从命令行取出参数
// const userArgs = process.argv.slice(2);
// if (!userArgs[0].startsWith('mongodb://')) {
//   console.log('错误：需要指定一个合法的 MongoDB URL 作为第一个参数。');
//   return;

// }

// // mongodb://admin:admin123@123.57.254.158:27017/test?authSource=admin 这里路径后的test为数据库名称
// // mongodb://admin:admin123@59.110.162.236:27017/test?authSource=admin
// // 连接数据库
// const mongoDB = userArgs[0];
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;// 这一句用意何在

// const Order = require('./testModel/order');
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));


// function orderCreate(name, amount, callback) {

//   const orderInstance = new Order({
//     name,
//     OrderbuyTime: new Date(),
//     Orderamount: amount,
//   });

//   orderInstance.save(err => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log('新建订单：' + orderInstance);
//     // order.push(orderInstance);
//     callback(null, orderInstance);

//   });
// }

// function createOrder(cb) {
//   async.parallel([
//     cb => orderCreate('001', 1, cb),
//     cb => orderCreate('002', 2, cb),
//     cb => orderCreate('003', 1, cb),
//   ], cb);
// }

// 测试MD5
const md5 = require('md5');
const message = md5('123456');
console.log(message);
// console.log(new Date().getDate());
const time = (new Date()).getTime() - 24 * 60 * 60 * 1000;
const yesterday = new Date(time);
console.log(yesterday);
