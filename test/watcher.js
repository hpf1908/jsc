var fs			= require('fs'),
	path		= require('path'),
	watcher     = require('../lib/watcher');

var Tester = module.exports = {

	start : function(){
		//this['test watcher folder']();
		this['test origin watch file']();
	},
	'test origin watch file' : function(){
		var path = __dirname + '/files';

		fs.watch(path + '/changed.js',function(){
			console.log(arguments);
		});
	},
	'test watcher folder' : function(){
		var path = __dirname + '/module/src';

		new watcher({
			root : path,
			callback : function(type , file){
				console.log(type + ':' + file);
			},
			filter : function(filename){
				return /\.(?:js|htm|html)$/.test(filename);
			}
		}).watch();

	}
 }

Tester.start();