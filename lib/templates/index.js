var logger		= require('../logger')(__filename),
	util 		= require('../util'),
	microTmpl   = require('./micro'),
	fs   		= require('fs');

var emptyFunc = function(tmpl , options){

	var breakLine = util.getLineBreak() ;
	var preVar = breakLine + 'var __p=[],_p=function(s){__p.push(s)};' + breakLine;
	var funcBeforeStr = 'function(){' + preVar;
	var funcAfterStr = breakLine + 'return __p.join("");'+ breakLine + '},' + breakLine;

	var preffix = "__p.push('";
	var suffix = "');" + breakLine;
	tmpl = preffix + util.escapeStr(tmpl) + suffix;

	return funcBeforeStr + tmpl + funcAfterStr;
}

exports.getEngine = function(engine){

	if(engine =='micro') {
		return microTmpl;
	} else {
		logger.warn('thie engine ${name} not supported yet' , {
			name : engine
		});
		return emptyFunc;
	}
}