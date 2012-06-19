//create by jsc
define(function(require){

	require.get = require;
	
	return require;
});
define("./test",[],function(require , exports , module){
	return {
		init : function(){
			console.log('hello world');
		}
	}
});

