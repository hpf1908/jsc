//create by jsc
define(function(require){

	require.get = require;
	
	return require;
});
define("./a",[],function(require , exports , module){
	return {
		init : function(){
			console.log('hello world module');
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

define("./tmpl",[],function(require, exports, module){
var tmpl = { 
"a_tmpl":function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push(' 		<div>hello world</div>\
 		');
 for(var i = 0; i < 5; i++){__p.push(' 			');
_p(i);
__p.push(' 		');
}__p.push(' 	');

return __p.join("");
},

"b_tmpl":function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push(' 		<div>hello world</div>\
 		');
 for(var i = 0; i < 5; i++){__p.push(' 			');
_p(i);
__p.push(' 		');
}__p.push(' 	');

return __p.join("");
}
};
return tmpl;
});