/**
 * watcher
 * 监听文件改变，适合文件数少时
 * @author youkunhuang
 * @author flyhuang
 */

var logger		= require('./logger')(__filename),
	fs			= require('fs'),
	path		= require('path'),
	config		= require('./config'),
	util        = require('./util');

var watcher = module.exports = function(options){

	this.opts = util.extend({
		root : root,
		callback : function(){},
		filter : config.filter
	} , options);

	this.callback = this.opts.callback;
	this.cache = {};
	logger.info('root: ${root}',{root: this.opts.root});
}

watcher.prototype.watch = function(){

	var self = this;

	setInterval(function(){
		if(typeof(self.opts.root)==='string') {
			self.getAllFile(self.opts.root);
		}else {
			self.opts.root.forEach(function (val) {
				self.getAllFile(val);
			});
		}
	},1000);

}

watcher.prototype.watchFiles = function(files){

	var self = this;

	setInterval(function(){
		if(typeof(root)==='string') {
			self.checkChange([files]);
		}else {
			self.checkChange(files);
		}
	},1000);
}

/**
 *
 * 检查所有文件是否有新文件
 * @param {String} root 要监听的目录
 *
 */
watcher.prototype.getAllFile = function(root){

	var files = util.getFilesSync(root , {
	    recurse : false ,
	    filter : this.opts.filter,
	    iterator : function(name){
	    	return root + '/' + name;
	    }
	});

	this.checkChange(files);
};

watcher.prototype.checkChange = function(files){

	var self = this;

	files.forEach(function(file, i){
		if(!self.cache[file]){
			logger.debug('new file: ${file}',{file: file});
			self.cache[file] = 1;
			self._fileAdded(file);
		}
	});
}

watcher.prototype._fileAdded = function(file){

	var self = this;

	try{
		fs.watch(file, function (curr, prev) {
			if(fs.existsSync(file)){
				self._fileChaned(file);
			} else{
				self._fileRemoved(file);
			}
		});
	}catch(e){	
		try {
			fs.watchFile(file, function(curr, prev){
				if (fs.existsSync(file)) {
					changeFile(file);
				} else {
					removeFile(file);
				}		
			});
		}catch (e) {
			logger.error('watch file error : ${file}' , {file : file});
		}
	}

}

watcher.prototype._fileChaned = function(file){
	logger.debug('change file: ${n}',{n: file});
	this.callback('change',file);
}

watcher.prototype._fileRemoved = function(file){

	logger.debug('remove file: ${n}',{n: file});
	this.callback('remove',file);
}
