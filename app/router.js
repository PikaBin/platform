'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 平台员工 注册，登录
  router.post('/platform/signup', controller.login.signUp);// 注册
  router.get('/platform/signin', controller.login.signIn_get); // 返回验证码 代码
  router.get('/platform/signin_test', controller.login.signIn_test); // 返回验证码图片
  router.post('/platform/signin', controller.login.signIn); // 处理登录

  /**
   * staff 员工基础信息
   */
  router.post('/platform/addstaff', controller.staff.addStaff); // 新增平台员工
  router.get('/platform/querystaff', controller.staff.queryStaff); // 查询平台员工


  /**
   * 审核
   */
  router.get('/platform/verifyAmount/', controller.verifyController.verifyAmount); // 获取 待审核 数量
  router.post('/platform/verifycategory', controller.verifyController.verifyCategory); // 处理前端操作

  router.get('/platform/queryadjust', controller.verifyController.queryAdjust); // 获取 审核列表（可过滤）

  // 品类审核
  router.post('/platform/verifycategory', controller.verifyController.verifyCategory); // 处理品类审核


  /**
   * 工单
   */
  router.get('/platform/findnewOrder', controller.workorder.findOrder); // 发现新增的订单
  router.post('/platform/addworkorder', controller.workorder.workorderAdd); // 自动增加工单

  /**
   * 运营商
   */
  router.get('/platform/queryoperator/', controller.operatorInfo.queryOperator); // 查询运营商
  router.post('/platform/addoperator', controller.operatorInfo.addOperator); // 添加运营商
  router.post('/platform/addcontract', controller.operatorInfo.addContract); // 新增运营商合约
  router.get('/platform/querycontract', controller.operatorInfo.queryO_contract); // 查询运营商合约
  router.post('/platform/verifyoperator', controller.verifyController.verifyOperator); // 处理运营商申请
  /**
   * 订单
   */
  router.get('/platform/queryorder', controller.order.queryOrder); // 查询订单，根据订单信息
  router.get('/platform/queryworkorder', controller.order.queryWorkorder); // 查询订单对应的工单

  /**
   * 现金流量表
   */
  router.get('/platform/querycash', controller.cashflow.queryCashflow); // 查询现金流量表

  /**
   * 消息管理
   */
  router.get('/platform/getnews', controller.news.getNews); // 接受消息
  router.post('/platform/setread', controller.news.setRead); // 消息阅读

  /**
   * 数据分析
   */
  // 首页 销售额
  router.get('/plarform/totalamout', controller.homeanalysis.totalAmount); // 首页销售额
};
