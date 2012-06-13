/**
 * html文件解析处理方法
 * @author flyhuang
 */

var logger		= require('../logger')(__filename),
	util 		= require('../util'),
	fs   		= require('fs');

var filterFile = function(filename){
	return /\.(?:tmpl|page).tmpl?$/i.test(filename);
}

/**
 * 生成简易模板
 */
var microTmpl = (function(){

	var regCode = /<%(=?)([\w\W\r\n]*?)%>(?:\r\n|\r|\n)?/gmi;

	var funcBeforeStr = 'function(data){\r\n\nvar __p=[],_p=function(s){__p.push(s)};\r\n';
	var funcAfterStr = '\r\nreturn __p.join("");\r\n},\r\n\r\n';

	return function(tmpl){

		tmpl = util.analyzeStringByReg(tmpl , regCode ,{
			merge : true , 
			beforehandler : function(str){
				var preffix = "__p.push('";
				var suffix = "');\r\n";
				var center = util.escapeStr(str);

				return preffix + center + suffix;
			},
			parseHandler : function(str , exec){
				var eq = exec[1];
				var jscode = exec[2];

				if(eq){
					return '_p(' + jscode + ');\r\n';
				} else{
					return jscode;
				}
			}
		});

		return funcBeforeStr + tmpl + funcAfterStr;
	}
})();

var getTmplEngine = function(type){

	if(type=='micro') {
		return microTmpl;
	} else {
		return '';
	}
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

		var tmplEngine = getTmplEngine(options.engine);
		var beforeWrap = 'define(' + mname + 'function(require, exports, module){\nvar tmpl = { \r\n';
		var afterWrap = '\r\n};\nreturn tmpl;\r\n});'

		var result = util.analyzeStringByReg(tmpl , reg ,{
			merge : false,
			parseHandler : function(str , exec){

				var tmp = exec[0];

				if(!isID.test(tmp)){
					return '';
				}

				var id = isID.exec(tmp)[1];
				var parseTmpl  = tmplEngine(str);

				id = '"' + id + '":';

				return id + parseTmpl;
			} 
		});	

		//删除最后一个,号
		result = result.slice(0 , result.lastIndexOf(','));

		return beforeWrap + result + afterWrap;
	}
})();


/**
 * 解析模板文件
 */
exports.parse = function(folder , options){

	options = util.extend({
		charset  : 'UTF-8',
		mname    : '',
		engine   : 'micro'
	},options);

	var files = util.getFilesSync(folder , {
		recurse : false,          //是否递归
	  	filter  : filterFile      //文件过滤函数
	}) , self = this, res = [] , tmpl = [];

	files = util.sortFiles(files);

	files.forEach(function(filename, i){

		var str = fs.readFileSync(folder + '/' + filename, options.charset);
		tmpl.push(str);
	});

	tmpl = tmpl.join('');

	var result = this.parseTmpl(options.mname , tmpl , {
		engine : options.engine
	});

	return result;
}





