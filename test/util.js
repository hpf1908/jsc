var util = require('../lib/util');


var Tester = module.exports = {

	start : function(){
		this['test copy files']();
	},
	'test copy files' : function(){

		util.copyFile('./files/a.js','./files/a_copy.js');
	}
 }

Tester.start();