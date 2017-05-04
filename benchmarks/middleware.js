// 检查进程环境的 middleware 数量并输出， 访问端口3333会写入字节流 'Hello world!'
var http = require('http');
var express = require('..');
var app = express();

// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

var body = new Buffer('Hello World');

app.use(function(req, res, next){
  res.send(body);
});

app.listen(3333);
