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


define("./tmpl",[],function(require, exports, module){
var tmpl = { 
"optimized_tmpl_1":function(data){
var __p=[],_p=function(s){__p.push(s)};
var items= data.items;
__p.push('	<div>hello world</div>\
	');
 for(var i = 0; i < items.length; i++){__p.push('		');
_p(items[i]);
__p.push('</br>\
	');
}__p.push('');

return __p.join("");
},
"optimized_tmpl_2":function(data){
var __p=[],_p=function(s){__p.push(s)};
var realname= data.realname,title= data.title,province= data.province;
__p.push('	<div>user Info:</div>\
	');
_p(realname);
__p.push('</br>\
	');
_p(title);
__p.push('</br>\
	');
_p(province);
__p.push('</br>');

return __p.join("");
}
};
return tmpl;
});