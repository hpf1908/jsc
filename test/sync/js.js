//create by jsc
define(function(require){

	require.get = require;
	
	return require;
});
define("./a",[],function(require , exports , module){
	return {
		init : function(){
			console.log('files changed good hello world');
		}
	}
});

define("./b",[],function(require , exports , module){
	return {
		init : function(){
			console.log('files changed good hello world');
		}
	}
});

define("./c",[],function(require , exports , module){
	return {
		init : function(){
			console.log('files changed good hello world');
		}
	}
});

