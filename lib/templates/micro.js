var logger		= require('../logger')(__filename),
	util 		= require('../util'),
	fs   		= require('fs');

/**
 * 生成简易模板
 */
var microTmpl = module.exports = (function(){

	var breakLine = util.getLineBreak() ;
	var regCode = /<%(=?)([\w\W\r\n]*?)%>(?:\r\n|\r|\n)?/gmi;
	var preVar = breakLine + 'var __p=[],_p=function(s){__p.push(s)};' + breakLine;
	var funcBeforeStr = 'function(data){'+ preVar;
	var funcAfterStr = breakLine + 'return __p.join("");'+ breakLine + '},' + breakLine;

	return function(tmpl , options){

		tmpl = util.analyzeStringByReg(tmpl , regCode ,{
			merge : true , 
			beforehandler : function(str){
				var preffix = "__p.push('";
				var suffix = "');" + breakLine;
				var center = util.escapeStr(str);

				return preffix + center + suffix;
			},
			parseHandler : function(str , exec){
				var eq = exec[1];
				var jscode = exec[2];

				if(eq){
					return '_p(' + jscode + ');' + breakLine;
				} else{
					return jscode;
				}
			}
		});

		if(options.optimized) {
			try{

				//使用uglifyjs获取ast解析代码是否有效
				var jsp = require("uglify-js").parser,
					pro = require("uglify-js").uglify;


				var undefineVars = [];
				var tempCode = preVar + tmpl;
				var ast = jsp.parse(tempCode); // parse code and get the initial AST
				ast = pro.ast_mangle(ast); // get a new AST with mangled names

				for(var key in ast.scope.refs) {
					if(ast.scope.refs[key] == undefined) {  
						undefineVars.push(key);
					}
				}

				if(undefineVars.length > 0) {
					var t = 'var ' + undefineVars[0] + '= data.' + undefineVars[0];
					for (var i = 1; i < undefineVars.length; i++) {
						t+= ',' + undefineVars[i] + '= data.' + undefineVars[i];
					};
					t+= ';' + breakLine;
					tmpl = t + tmpl;
				}
			} catch(e) {
				logger.error(e.message);
			}
		}

		return funcBeforeStr + tmpl + funcAfterStr;
	}
})();