define("./tmpl",[],function(require, exports, module){
var tmpl = { 
"a_tmpl":function(data){
var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div>hello world from submodule</div>\
	');
 for(var i = 0; i < 5; i++){__p.push('		');
_p(i);
__p.push('	');
}__p.push('');

return __p.join("");
},
"a1_tmpl":function(data){
var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div>hello world from submodule</div>\
	');
 for(var i = 0; i < 5; i++){__p.push('		');
_p(i);
__p.push('	');
}__p.push('');

return __p.join("");
}
};
return tmpl;
});