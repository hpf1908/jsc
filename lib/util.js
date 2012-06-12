/**
 * file 工具类
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
 */
 exports.getFilesSync = function(path, options ){
 	
 	var files = fs.readdirSync(path);
 	var outputFiles = [];

	files.forEach(function(name, i){
		if(options.filter(name) && fs.statSync(path + '/' + name).isFile()){
			outputFiles.push(name);
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
 exports.normalizePath = function(){

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

 

