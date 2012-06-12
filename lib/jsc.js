/**
 * jsc：把模板转换成js，合并js
 * @author youkunhuang
 *
 */


var logger		= require('./logger')(__filename),
	fs          = require('fs'),
	jsParser    = require('./parser/js'),
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

	return true;
}