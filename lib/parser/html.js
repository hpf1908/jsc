/**
 * html文件解析处理方法
 * @author flyhuang
 */
var logger		= require('../logger')(__filename),
	util 		= require('../util'),
	fs   		= require('fs'),
	templates   = require('../templates/index');

var filterFile = function(filename){
	return /\.(?:tmpl|page).htm?$/i.test(filename);
}

/**
 * 生成模板文件
 * @param mname  
 * @param script  
 */
exports.parseTmpl = (function(){

	var reg = /<script([^<>]+?)type="text\/html"([\w\W\r\n]*?)>(?:\r\n|\r|\n)?([\w\W\r\n]*?)(?:\r\n|\r|\n)?<\/script>/gmi;
	var isID = /id="(.+?)"/i;


	return function(mname , tmpl , options){

		if(arguments.length<=0 || arguments.length>3) {
			return '';
		}

		if(arguments.length == 2) {
			options = tmpl;
			tmpl = mname;
		} else if(arguments.length == 1){
			tmpl = mname;
			mname = '';
			options = {};
		}

		options = util.extend({
			engine : 'micro'
		},options);

		mname = mname ? '"' + mname + '",[],' : '';

		//获取指定的模板引擎用于将模板编译为js函数
		var tmplEngine = templates.getEngine(options.engine);
		var beforeWrap = 'define(' + mname + 'function(require, exports, module){\nvar tmpl = { \r\n';
		var afterWrap = '\r\n};\nreturn tmpl;\r\n});'

		var result = util.analyzeStringByReg(tmpl , reg ,{
			merge : false,
			parseHandler : function(str , exec){

				var tmp = exec[0];

				if(!isID.test(tmp)){
					return '';
				}

				var code = exec[3];

				var id = isID.exec(tmp)[1];
				var parseTmpl  = tmplEngine(code , options);

				id = '"' + id + '":';

				return id + parseTmpl;
			} 
		});	

		//删除最后一个,号
		result = result.slice(0 , result.lastIndexOf(','));

		return util.normalizeBreakLine(beforeWrap + result + afterWrap);
	}
})();


/**
 * 解析模板文件
 */
exports.parse = function(folder , options){

	options = util.extend({
		charset  : 'UTF-8',
		mname    : '',
		engine   : 'micro',
		recurse : false, 
		filter  : filterFile
	},options);

	var files = util.getFilesSync(folder , options) , 
		self = this, 
		res = [] , 
		tmpl = [];

	files = util.sortFiles(files);

	files.forEach(function(filename, i){

		var str = fs.readFileSync(folder + '/' + filename, options.charset);
		tmpl.push(str);
	});

	tmpl = tmpl.join('');

	var result = this.parseTmpl(options.mname , tmpl , options);

	return result;
}





