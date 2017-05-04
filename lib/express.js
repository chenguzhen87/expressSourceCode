/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies. 引入 模块依赖
 */
// express js 项目入口
var EventEmitter = require('events').EventEmitter;
// 混合类型;混进   https://github.com/component/merge-descriptors
var mixin = require('merge-descriptors');
// 项目已有实现模块
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');

/**
 * Expose `createApplication()`. 暴露 createApplication 接口
 */

exports = module.exports = createApplication;

/**
 * Create an express application. 创建一个 express 应用
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };
  // 混合 事件发射器的原型 ， application 到 app 对象上,  redefine=false (不重新定义目标中的属性)
  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  // 暴露接口原型之后， request 对象将可以读写
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
  // init 方法在 原型 proto 上， 在 application 中定义
  app.init();
  return app;
}

/**
 * Expose the prototypes. 暴露原型
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors. 暴露构造函数
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware.  暴露中间件
 */

exports.query = require('./middleware/query');
// serve-static
exports.static = require('serve-static');

/**
 * Replace removed middleware with an appropriate error message.
 */

[
  'json',
  'urlencoded',
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache',
].forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});
