/* eslint-disable object-shorthand */
/**
 * 注册，以及登录方法
 */
'use strict';
const Controller = require('egg').Controller;

class LoginController extends Controller {

  // 注册
  async signUp() {
    // console.log(this.ctx.request.body);
    const Staff = this.ctx.model.Staff;
    // console.log('password:' + typeof (this.ctx.request.body.password) + this.ctx.request.body.password);
    try {
      const account = await this.ctx.request.body.account;
      const password = await this.service.tools.md5(this.ctx.request.body.password);
      const staffInstance = await Staff.create({
        account: account,
        password: password,
      });
      // 注册成功，返回前端数据
      this.ctx.body = staffInstance + '注册成功';
      this.ctx.status = 200;
    } catch (err) { //  注册失败，捕获原因
      console.log('err信息' + err);
      return;
    }


  }

  async signIn_get() {
    const captcha = await this.ctx.service.tools.captcha();
    // this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = {
      verify_image: captcha.data,
    };
  }
  // 展示登录页面中的验证码
  async signIn_test() {
    const captcha = await this.ctx.service.tools.captcha();
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }


  // 登录 验证码，查询账户，密码
  async signIn() {

    const { account, code } = await this.ctx.request.body;
    console.log(account);
    const password = await this.service.tools.md5(this.ctx.request.body.password);
    // 判断验证码
    if (code.toUpperCase() === this.ctx.session.code.toUpperCase()) {
      const result = await this.ctx.model.Staff.find({ account, password });
      if (result.length > 0) {
        this.ctx.session.userinfo = result[0];
        this.ctx.body = {
          result,
          status: 'ok',
          authority: 'admin',
        };
        console.log('查询结果信息：' + result[0]);
      } else {
        this.ctx.body = {
          status: 'failed',
          authority: 'admin',
          information: '用户名或者密码不正确',
        };
        return;
      }
    } else {
      this.ctx.body = {
        status: 'failed',
        authority: 'admin',
        information: '验证码不正确',
      };
      return;
    }
  }
}

module.exports = LoginController;
