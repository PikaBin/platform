/**
 * 此文件是向数据库中添加测试数据，
 */
'use strict';

console.log('此文件是用来向数据库填充测试数据，如专才，单品，品类，客户等等，需要使用数据库地址作为参数');

// 从命令行取出参数
const userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('错误：需要指定一个合法的 MongoDB URL 作为第一个参数。');
  return;

}

const async = require('async');
const mongoose = require('mongoose');
// mongodb://admin:admin123@123.57.254.158:27017/test?authSource=admin
// 连接数据库
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;// 这一句用意何在

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

// 引入模型
const Category = require('./testModel/category');
const Rule = require('./testModel/rule');

// 用来存储表中的数据
const category = [];
const rules = [];

// 构造 Category模型的实例
function categoryCreate(name, introd, rule, callback) {

  const categoryInstance = new Category({
    categoryName: name,
    categoryIntrod: introd,
    // evalute_indicator: evalute,
    categoryRule: rule,
    // categoryQuality: quality,
  });

  categoryInstance.save(function(err) {
    if (err) {
      callback(err);
      console.log(err);
      return;
    }
    console.log('新建品类：' + categoryInstance);
    category.push(categoryInstance);
    callback(null, categoryInstance);
  });
}

// 构造 rule 模型的实例
function ruleCreate(name, introd, callback) {
  const ruleInstance = new Rule({
    _id: new mongoose.Types.ObjectId(),
    ruleName: name,
    ruleIntrod: introd,
  });

  ruleInstance.save(function(err) {
    if (err) {
      callback(err);
      return;
    }
    console.log('创建规则: ' + ruleInstance);
    rules.push(ruleInstance);
    callback(null, ruleInstance);
  });
}

// 填充具体的数据
function createCategory(cb) {
  async.parallel([
    callback => categoryCreate('理财', '对财务（财产和债务）进行管理，以实现财务的保值、增值为目的', rules[0], callback),
    callback => categoryCreate('法律咨询', '指从事法律服务的人员就有关法律事务问题作出解释、说明，提出建议和解决方案的活动', rules[1], callback),
  ], cb);
}

function createRule(cb) {
  async.parallel([
    callback => ruleCreate('时间', '服务是否及时', callback),
    callback => ruleCreate('效果', '效果是否显著', callback),
  ], cb);
}

// 顺序执行上述函数

async.series(
  [
    createRule,
    createCategory,
  ],
  // 可选回调
  err => {
    console.log(
      err ?
        '最终错误：' + err :
        '品类：' + category
    );
    // 操作完成，断开数据库连接
    db.close();
  }
);
