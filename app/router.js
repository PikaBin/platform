'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 注册，登录

  router.post('/platform/signup', controller.login.signUp);// 注册
  router.get('/platform/signin', controller.login.signIn_get); // 返回验证码 代码
  router.get('/platform/signin_test', controller.login.signIn_test); // 返回验证码图片
  router.post('/platform/signin', controller.login.signIn); // 处理登录

  /**
   * staff
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

};
