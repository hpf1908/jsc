var jsc      = require('../lib/jsc'),
	jsParser = require('../lib/parser/js'),
	fs		 = require('fs'),
	should   = require('should');

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
	}
}

//module.exports['should parse module add name and deps']();
//module.exports['should parse js by given path']();
module.exports['should create js by given path']();

