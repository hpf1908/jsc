/**
 * 指定两个目录，主目录标识了需要同步的文件，子目录对应的文件改变随时同步到主目录
 * @author flyhuang
 */

var logger      = require('./logger')(__filename),
    fs          = require('fs'),
    util        = require('./util'),
    watcher     = require('./watcher');

var getFileName = function(str){
	var pos = str.lastIndexOf("/")*1;
    return str.substring(pos+1);
}

var filter = function(file){
	return /\.(?:js)$/.test(file);
}

var Sync = module.exports = function(master , slave , options){

	var self = this;

	this.opts = util.extend({
		slaveCallback : function(){},
		masterCallback : function(){}
	},options);

	this.masterWathcher = new watcher({
		root : master,
		filter : filter,
        callback : function(type , file){
        	self._checked(type , file , true);
        	self.opts.masterCallback(type , file);
        }
	}).watch();

	this.slaveWathcher = new watcher({
		root : slave,
		filter : filter,
        callback : function(type , file){
        	self._checked(type , file , false);
        	self.opts.slaveCallback(type , file);
        }
	}).watch();

	this._checkedAll(true);
	this._inited = true;
}

Sync.prototype._unifiedFiles = function(files){
	var result = {};
	for(var key in files) {
		var filename = getFileName(key);
		result[filename] = {
			path : key,
			name : filename
		}
	}
	return result;
}

Sync.prototype._loadSyncFiles = function(){

	var masterFiles = this.masterFiles = this._unifiedFiles(this.masterWathcher.getFiles());
	var slaveFiles  = this.slaveFiles  = this._unifiedFiles(this.slaveWathcher.getFiles());

	this.syncFiles = {};

	for(var key in masterFiles) {
		if(slaveFiles[key]) {
			this.syncFiles[key] = {
				masterPath : masterFiles[key].path,
				slavePath  : slaveFiles[key].path
			}
		}
	}
}

Sync.prototype._checkedAll = function(reload){

	if(reload) {
		this._loadSyncFiles();
	}

	var syncFiles = this.syncFiles;
	for(var key in syncFiles) {
		var syncFile = syncFiles[key];
		//将子目录文件向上层目录文件复制
		util.copyFile(syncFile.slavePath,syncFile.masterPath);
	}
}

Sync.prototype._checked = function(type , file , isMaster){

	if(!this._inited) {
		return;
	}

	var filename = getFileName(file);

	var fileObj = {
		path : file,
		name : filename
	};

	if(type == 'remove') {
		if(isMaster && this.masterFiles[filename]) {
			delete this.masterFiles[filename];
		} else if(!isMaster && this.slaveFiles[filename]){
			delete this.slaveFiles[filename];
		}

		if(this.syncFiles[filename]) {
			delete this.syncFiles[filename];
		}

		this._removed(filename , isMaster);
	} else if(type == 'change') {
		this._changed(filename , isMaster);
	} else if(type == 'add') {
		if(isMaster) {
			this.masterFiles[filename] = fileObj;
		} else {
			this.slaveFiles[filename] = fileObj;
		}
		this._added(filename , isMaster);
	}
}

Sync.prototype._removed = function(file , isMaster){
	//just do nothing 
}

Sync.prototype._changed = function(file , isMaster){
	var syncFile = this.syncFiles[file];
	if(syncFile) {
		util.copyFile(syncFile.slavePath,syncFile.masterPath);
		logger.debug('sync file changed : ${master} ', {master: syncFile.masterPath});
	}
}

Sync.prototype._added = function(file , isMaster){
	//只有当上层目录存在对应文件时才同步子目录的小文件
	if(this.masterFiles[file] && this.slaveFiles[file]) {
		var syncFile = this.syncFiles[file] = {
			masterPath : this.masterFiles[file].path,
			slavePath  : this.slaveFiles[file].path
		}
		util.copyFile(syncFile.slavePath,syncFile.masterPath);
		logger.debug('sync file changed : ${master} ', {master: syncFile.masterPath});
	}
}

