var jsc      	= require('../lib/jsc'),
	jsParser 	= require('../lib/parser/js'),
	htmlParser 	= require('../lib/parser/html'),
	fs		 	= require('fs'),
	util	 	= require('../lib/util'),
	should   	= require('should');

module.exports = {

	'should parse module add name and deps' : function(){

		var inputStr = fs.readFileSync('./files/a.js' ,'UTF-8');

		var outputCorrectStr = fs.readFileSync('./files/a_correct.js' ,'UTF-8');

		var outputStr = jsParser.parseModule('./a',inputStr);

		outputStr.should.equal(outputCorrectStr);
	},
	'should parse js by given path' : function(){
		var path = __dirname + '/module/src';
		var outputStr = jsParser.parse(path);
		var outputCorrectStr = fs.readFileSync('./module/js_correct.js' ,'UTF-8');
		outputStr.should.equal(outputCorrectStr);
	},
	'should create js by given path' : function(){
		
		var path = __dirname + '/module/src';
		var output = __dirname + '/module/js.js';
		jsc.createJs(path , output);
	},
	'should splite string by reg' : function(){

		var regTmpl = /<script([^<>]+?)type="text\/html"([\w\W\r\n]*?)>(?:\r\n|\r|\n)?([\w\W\r\n]*?)(?:\r\n|\r|\n)?<\/script>/gmi;
		var inputStr = '<html><script type="text/html" id="a_tmpl">' +
							'<div>hello world</div>'+
						'</script></html>';

		var outputStr = util.analyzeStringByReg(inputStr , regTmpl, {
			merge : true,
			parseHandler : function(str , exec){
				return 'test';
			}
		});

		var outputCorrectStr = '<html>test</html>';

		outputStr.should.equal(outputCorrectStr);

	},
	'should parse tmpl to js template' : function(){

		var inputStr = fs.readFileSync('./module/src/a.page.tmpl' ,'UTF-8');
		var outputStr = htmlParser.parseTmpl(inputStr);

		//console.log(outputStr);
	},
	'should parse tmpl widh folder' : function(){
		var path = __dirname + '/module/src';
		var outputStr = htmlParser.parse(path);

		//console.log(outputStr);
	},
	'should create tmpl widh folder' : function(){
		var path = __dirname + '/module/src';
		var output = __dirname + '/module/tmpl.js';
		jsc.createTmpl(path , output , {
			mname : './tmpl'
		});
	}
}

/*
module.exports['should parse module add name and deps']();
module.exports['should parse js by given path']();
module.exports['should create js by given path']();
module.exports['should splite string by reg']();
module.exports['should parse tmpl to js template']();
module.exports['should parse tmpl widh folder']();
module.exports['should create tmpl widh folder']();
*/


