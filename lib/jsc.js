/**
 * jsc：把模板转换成js，合并js
 * @author youkunhuang
 * @edit flyhuang
 */


var logger		= require('./logger')(__filename),
	fs          = require('fs'),
	jsParser    = require('./parser/js'),
	htmlParser 	= require('../lib/parser/html'),
	util        = require('./util'),
	config      = require('./config'),
	undefined;



/**
 * @param folder 待读取的目录
 * @param target 生成的文件
 * @param options 配置项
 */
exports.createJs = function(folder , target , options){

	options = util.extend({
		charset  : 'UTF-8',
		relative : './'
	},options);

	var result = config.defaultModule + jsParser.parse(folder , options);

	fs.writeFileSync(
		target,
		result,
		options.charset
	);	

	return result;
}


/**
 * @param folder 待读取的目录
 * @param target 生成的文件
 * @param options 配置项
 */
exports.createTmpl = function(folder , target , options){

	options = util.extend({
		charset  : 'UTF-8',
		mname	 : ''
	},options);

	var result = htmlParser.parse(folder , options);

	fs.writeFileSync(
		target,
		result,
		options.charset
	);	

	return result;
}

/**
 * @param folder 待读取的目录
 * @param options 配置项
 */
exports.createAll = function(folder , options){

	options = util.extend({
		charset     : 'UTF-8',
		mname	    : '',
		relative    : './',
		jsTarget    : null,
		tmplTarget  : null,
		indexTarget : null
	},options);

	var tmpl = this.createTmpl(folder , options.tmplTarget ,options);
	var js = this.createJs(folder , options.jsTarget , options);
	var result = js  + util.getLineBreak() + tmpl;

	fs.writeFileSync(
		options.indexTarget,
		result,
		options.charset
	);	

	return result;
}