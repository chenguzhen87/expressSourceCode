/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
// A simple cross platform implementation to set the prototype of an instianted object. Supports all modern browsers and at least back to IE8.
var setPrototypeOf = require('setprototypeof')

/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

exports.init = function(app){
  return function expressInit(req, res, next){
    // https://segmentfault.com/q/1010000002224561 
    // 这个不是Apache或者Nginx输出的，而是由语言解析器或者应用程序框架输出的。这个值的意义用于告知网站是用何种语言或框架编写的
    // 设置头部 X-Powered-By 的为 Express
    if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
    // 
    req.res = res;
    res.req = req;
    req.next = next;

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    res.locals = res.locals || Object.create(null);

    next();
  };
};

