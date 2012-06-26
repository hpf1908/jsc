var fs = require('fs');
var path = require('path');

//seajs根目录
this.seajsRoot = __dirname + '/../';

//全部输出文件名
this.outputALL = 'index.js';

//js输出文件名
this.outputJS = 'js.js';

//html输出文件名
this.outputHTML = 'tmpl.js';

//监听指定后缀的文件
this.filter = function(file){
	return /\.(?:js|htm|html)$/.test(file);
};

//附加的监听目录
this.isCustomCompilesFolder = function(parent , name){

}

//将被添加到js文件合并的前面
this.beforeJS = fs.readFileSync(__dirname + '/wrap/seajs.before.wrap','UTF-8');

//将被添加到js文件合并的末尾
this.afterJS = fs.readFileSync(__dirname + '/wrap/seajs.after.wrap','UTF-8');

//默认模块
this.defaultModule = fs.readFileSync(__dirname + '/wrap/seajs.defaultModule.wrap','UTF-8');

