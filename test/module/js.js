//create by jsc
define(function(require){

	require.get = require;
	
	return require;
});
define("./a",[],function(require , exports , module){
	return {
		init : function(){
			console.log('hello world');
		}
	}
});

define("./b",function(require , exports , module){
	var c = require('./c');

	return {
		init : function(){
			console.log('b');
			c.init();
		}
	}
});
