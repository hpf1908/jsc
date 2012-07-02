/**
 * 压缩js
 * @author flyhuang
 */

var logger		= require('./logger')(__filename),
	fs          = require('fs'),
	util        = require('./util'),
	jsp         = require("uglify-js").parser,
	pro         = require("uglify-js").uglify,
	undefined;

var compressFile = function(src , target , options){

	options = util.extend({
		charset : 'UTF-8'
	},options);
 
	var orig_code = fs.readFileSync(src , options.charset);

	var ast = jsp.parse(orig_code); 
	ast = pro.ast_mangle(ast); 
	ast = pro.ast_squeeze(ast); 
	var final_code = pro.gen_code(ast); 

	fs.writeFileSync(
		target,
		final_code,
		options.charset
	);	

	return final_code;
}

var compressFolder = function(src ,  target , options){

	if(!fs.existsSync(src)){
		logger.warn('not exist src folder ${folder}' ,{ folder : src});
		return false;
	}

	if(!fs.existsSync(target)){
		logger.warn('not exist target folder ${folder}' ,{ folder : target});
		return false;
	}

	options = util.extend({
		charset : 'UTF-8',
		filter  : function(file){
			return /\.(?:js)$/.test(file);
		}
	},options);

	var files = fs.readdirSync(src);

	files.forEach(function(filename, i){
		var sfile  = src + '/' + filename;
		var tfile  = target + '/' + filename;
		if(fs.statSync(sfile).isDirectory()){
			if(!fs.existsSync(tfile)){
				fs.mkdirSync(tfile);
			}
			compressFolder(sfile , tfile);
		} else {
			if(options.filter(filename)) {
				compressFile(sfile , tfile);
			}
		}	
	});

	return true;
} 


exports.compressFile   = compressFile;
exports.compressFolder = compressFolder;