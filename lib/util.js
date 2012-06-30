/**
 * 工具类
 * @author flyhuang
 */

var fs = require("fs");

/**
 * 给定一个路径获取该路径下的指定文件
 * @param path    文件路径
 * @param options 配置参数
   {
	  recurse ： true,      //是否递归
	  filter  : null      //文件过滤函数
   }
   @todo 递归查找
 */
 exports.getFilesSync = function(path, options){
 	
 	var files = fs.readdirSync(path);
 	var outputFiles = [];

 	options = this.extend({
 		iterator : function(name){
 			return name;
 		},
 		filter : function(){
 			return true;
 		}
 	},options);

	files.forEach(function(name, i){
		if(options.filter(name) && fs.statSync(path + '/' + name).isFile()){
			outputFiles.push(options.iterator(name));
		}
	});

 	return outputFiles;
 }

/**
 * 对文件进行排序
 * @param files    文件列表
 */
 exports.sortFiles = function(files){
	files.sort(function(a,b){
		return a >= b ? 1 : -1;
	});
	return files;
 }

/**
 * 将有斜杠的文件路径名统一
 * @param files    文件列表
 */
 exports.normalizePath = function(str){
 	return str.replace(/\\/g,'/');
 }

 /**
 * 将有斜杠的文件路径名统一
 * @param files    文件列表
 */
 exports.extend = function(src , tar){
 	for(var key in tar) {
 		src[key] = tar[key];
 	}
 	return src;
 }

 /**
 * 去除utf-8文件头的BOM标记
 * @param str  
 */
 exports.removeBom = function(str){
	str = str.replace(/^[\ufeff\ufffe]/,'');
	str = str.replace(/\r\n|\r|\n/gmi,"\r\n");
	return str;
 }


/**
 * 换行符号处理，unix系统使用\n，windows使用\r\n
 */
exports.normalizeBreakLine = function(str){
  	if (process.platform === 'win32') {
		str = str.replace(/\r\n|\r|\n/gmi,"\r\n");
	} else {
		str = str.replace(/\r\n|\r|\n/gmi,"\n");
	}
	return str;
 }


exports.getLineBreak = function(){
	if (process.platform === 'win32') {
		return '\r\n';
	} else {
		return '\n';
	}
 }

 exports.escapeStr = function(str){
	return  str.replace(/\\/gmi,"\\\\").replace(/'/gmi,"\\'").replace(/\r\n|\r|\n/gmi,"\\\r\n");
 }

/**
 * 解析正则中的字符串
 */
exports.analyzeStringByReg = function(str , reg , options){
	var index = 0;
	var res = [];
	var tmp = '';

	options = this.extend({
		merge : true,
		beforehandler : function(str){
			return str;
		},
		parseHandler : function(str){
			return str;
		}
	},options);

	var beforehandler = options.beforehandler;
	var parseHandler = options.parseHandler;

	while(exec  =  reg.exec(str)){
		var len = exec[0].length;

		if(index !== exec.index && options.merge){
			tmp = str.slice(index,exec.index);
			tmp = beforehandler(tmp);
			res.push(tmp);
		}

		var tmp = parseHandler(exec[0] , exec);
		res.push(tmp);

		if(exec) {
			index = exec.index + len;
		}
	}

	if(options.merge) {
		tmp = str.slice(index);
		tmp = beforehandler(tmp);
		res.push(tmp);	
	}

	return res.join('');
}


exports.copyFile = function(srcFile , targetFile){

	var fdIn = fs.openSync(srcFile, "r");
    var fdOut = fs.openSync(targetFile, "w");

    var bufferSize = 10240;
    var buffer = new Buffer(bufferSize);

    try {
        while (true) {
            var lengthRead = fs.readSync(fdIn, buffer, 0, bufferSize, null);
            if (lengthRead <= 0) break;
            fs.writeSync(fdOut, buffer, 0, lengthRead, null);
        }
    } finally {
        fs.closeSync(fdIn);
        fs.closeSync(fdOut);
    }
}
 

