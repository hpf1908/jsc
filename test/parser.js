var jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	fs	= require('fs');

var Tester = module.exports = {

	start : function() {
		
		for(var key in Tester) {

			if(key != 'start') {
				console.log('begin ' + key);
				this[key]();
				console.log('end ' + key);
			}	
		}
		
	},
	'should parse ast tree' : function(){

		/*
		var orig_code = "... JS code here";
		var ast = jsp.parse(orig_code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		*/
		try{
			var orig_code = fs.readFileSync('./files/ast_test.js' ,'UTF-8');
			var ast = jsp.parse(orig_code); // parse code and get the initial AST
			ast = pro.ast_mangle(ast); // get a new AST with mangled names

			console.log(ast.scope.refs);
			fs.writeFileSync(
				'./files/ast_test.ast',
				JSON.stringify(ast),
				'UTF-8'
			);		
		} catch(e) {
			console.log(e);
		}
	},
	'should parse ast tree error' : function(){

		/*
		var orig_code = "... JS code here";
		var ast = jsp.parse(orig_code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		*/
		try{
			var orig_code = fs.readFileSync('./files/ast_error.js' ,'UTF-8');
			var ast = jsp.parse(orig_code); // parse code and get the initial AST
			ast = pro.ast_mangle(ast); // get a new AST with mangled names

			fs.writeFileSync(
				'./files/ast_test.ast',
				JSON.stringify(ast),
				'UTF-8'
			);		
		} catch(e) {
			console.log(e);
		}
	}
}

Tester.start();