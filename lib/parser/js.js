/**
 * js文件解析处理方法
 * @author flyhuang
 */

var logger		= require('../logger')(__filename),
	util 		= require('../util'),
	fs   		= require('fs');

var filterFile = function(filename){
	return /\.js$/i.test(filename);
}


/**
 * 解析一个模块
 * @param mname  
 * @param script  
 */
exports.parseModule = function(mname , script){
	
	var deps = [];

	//扫描依赖关系
	script.replace(/require\(\W*[\'\"]([^\'\" ]+?)[\'\"]\W*\)/gmi,function($0,id){
		deps.push(id);
	});

	script = script.replace(/(define\()[\W]*?(function)/gm,'$1"' + mname + '",' + JSON.stringify(deps) + ',$2');

	return script;
}


/**
 * @param folder 待读取的目录
 * @param options 配置项
 */
exports.parse = function(folder  , options){

	options = util.extend({
		charset  : 'UTF-8',
		relative : './'
	},options);

	var files = util.getFilesSync(folder , {
		recurse : false,          //是否递归
	  	filter  : filterFile      //文件过滤函数
	}) , self = this, res = [];

	files = util.sortFiles(files);

	files.forEach(function(filename, i){

		var script = fs.readFileSync(folder + '/' + filename, options.charset);
		var mname = options.relative + filename.replace(/\.js$/i,'');

		script = util.removeBom(script);
		script = util.normalizeBreakLine(script);

		script = self.parseModule(mname , script);
		res.push(script,util.getLineBreak());
	});

	return res.join('');
}