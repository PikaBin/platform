'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    let count = ctx.cookies.get('count', { signed: true });
    // console.log(count);
    count = count ? Number(count) : 0;
    ctx.cookies.set('count', ++count, {
      httpOnly: false,
      expires: new Date(2020, 3, 14, 9, 4, 15),
    });
    const user = ctx.session.userinfo;
    console.log('user信息' + user);
    ctx.body = user;
    // ctx.session.visited = ctx.session.visited ? (ctx.session.visited + 1) : 1;
    // console.log(ctx.session.vv);
    // ctx.body = 'hi, egg' + ctx.session.visited + count;
  }


}

module.exports = HomeController;
