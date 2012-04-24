define(function(require){return require;});



define("examples/a",[],function(require , exports , module){

	return {
		init : function(){
			console.log('a');
		}
	}
});
define("examples/b",["./c"],function(require , exports , module){
	var c = require('./c');

	return {
		init : function(){
			console.log('b');
			c.init();
		}
	}
});
define("examples/c",[],function(require , exports , module){

	return {
		init : function(){
			console.log('c');
		}
	}
});


define("examples/tmpl",[],function(require, exports, module){
var tmpl = { 
};
return tmpl;
});