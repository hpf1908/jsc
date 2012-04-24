var fs = require('fs');

//seajs根目录
this.seajsRoot = __dirname + '/../';

//全部输出文件名
this.outputALL = 'index.js';

//js输出文件名
this.outputJS = 'js.js';

//html输出文件名
this.outputHTML = 'tmpl.js';

//监听指定后缀的文件
this.filter = /\.(?:js|htm|html)$/;

//将被添加到js文件合并的前面
this.beforeJS = fs.readFileSync(__dirname + '/seajs.before.wrap');

//将被添加到js文件合并的末尾
this.afterJS = fs.readFileSync(__dirname + '/seajs.after.wrap');


require('./config.wrapper.js')(this);
