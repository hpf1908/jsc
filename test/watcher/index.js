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


define("./tmpl",[],function(require, exports, module){
var tmpl = { 
"a_tmpl":function(data){
var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div>hello world</div>\
	');
 for(var i = 0; i < 5; i++){__p.push('		');
_p(i + 1);
__p.push('	');
}__p.push('');

return __p.join("");
}
};
return tmpl;
});