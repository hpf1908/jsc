define("./tmpl",[],function(require, exports, module){
var tmpl = { 
"a_tmpl":function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<script type="text/html" id="a_tmpl">\
 		<div>hello world</div>\
 		');
 for(var i = 0; i < 5; i++){__p.push(' 			');
_p(i);
__p.push(' 		');
}__p.push(' 	</script>');

return __p.join("");
},

"b_tmpl":function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<script type="text/html" id="b_tmpl">\
 		<div>hello world</div>\
 		');
 for(var i = 0; i < 5; i++){__p.push(' 			');
_p(i);
__p.push(' 		');
}__p.push(' 	</script>');

return __p.join("");
}
};
return tmpl;
});