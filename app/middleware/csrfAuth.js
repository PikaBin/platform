/* eslint-disable no-unused-vars */
/**
 * 解决csrf问题
 */
'use strict';
module.exports = (option, app) => {
  return async function(ctx, next) {
    ctx.state.csrf = ctx.csrf; // 通过state将csrf设为全局变量，这样前端就可以直接获取csrf值
    await next();
  };
};

