var fs			= require('fs'),
	path		= require('path'),
	Sync        = require('../lib/sync');

var Tester = module.exports = {

	start : function(){
		this['test sync files']();
	},
	'test sync files' : function(){

		new Sync('./sync','./sync/src');
	},
	'test copy file' : function(){

	}
 }

Tester.start();