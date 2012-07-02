var compress = require('../lib/compress');


var Tester = module.exports = {

	start : function(){
		this['test compress files']();
	},
	'test compress files' : function(){

		compress.compressFolder('./compress/src' , './compress/target');
	}
 }

Tester.start();