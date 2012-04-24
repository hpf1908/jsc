/**
 * watcher
 * 监听文件改变，适合文件数少时
 * @author youkunhuang
 *
 */

var logger		= require('./logger')(__filename),
	cp			= require('child_process'),
	fs			= require('fs'),
	config		= require('./config.js'),
	path		= require('path'),
	cache		= {},
	filter		= config.filter,
	self		= {},
	callback;


module.exports = {
	watch : function(root,callback){
		self.root = root;
		self.callback = callback;

		logger.info('root: ${root}',{root: root});

		setInterval(function(){
			if(typeof(root)==='string') {
				getAllFile(root);
			}else {
				root.forEach(function (val) {
					getAllFile(val);
				});
			}
		},1000);
	},
	watchFiles : function(files,callback){
		self.root = '';
		self.callback = callback;

		setInterval(function(){
			if(typeof(root)==='string') {
				checkChange([files]);
			}else {
				checkChange(files);
			}
		},1000);
	}
}

/**
 *
 * 检查所有文件是否有新文件
 * @param {String} root 要监听的目录
 *
 */
function _getAllFile(root){

	var shell	= 'ls ' + root, //'ls -R ' + root,
		res		= [],
		child,
		undefeinde
	;

	child = cp.exec(shell,function (error, stdout, stderr) {

		var res;

		if(error){
			logger.error(String(error));
			return;
		};

		res = getFileListFromStdout(stdout);

		checkChange(res);

	});

};

/**
 *
 * 检查所有文件是否有新文件
 * @param {String} root 要监听的目录
 *
 */
function getAllFile(root){

	var res		= [],
		child,tmp,
		undefeinde
	;

	tmp = fs.readdirSync(root);

	tmp.forEach(function(n,i){
		if(filter.test(n) && fs.statSync(root + '/' + n).isFile()){
			res.push(root + '/' + n);
		}
	});

	checkChange(res);

};


/**
 * 解析返回值中的文件名
 * @param {String} stdout ls命令输出的结果
 */
function getFileListFromStdout(stdout){

	var res		= [],
		curr	= root,
		tmp;

	stdout = stdout || '';
	tmp = stdout.split('\n');

	tmp.forEach(function(n,i){

		if(/^.+\:$/.test(n)){
			curr = path.resolve(root,n.slice(0,-1));
		}else if(filter.test(n)){
			res.push(curr + '/' + n);
		}

	});

	return res;

};

/**
 *
 * 检查变化
 *
 */
function checkChange(files){

	files.forEach(function(n,i){

		if(!cache[n]){

			logger.debug('new file: ${n}',{n: n.replace(/^.*[\/\\](.+)$/gmi,'$1')});

			cache[n] = 1;
			newFile(n);
		}

	});

};

/**
 *
 * 发现新文件
 *
 * @param {Object} file
 */
function newFile(file){

	try{

		fs.watch(file, function (curr, prev) {

			if(path.existsSync(file)){
				changeFile(file);
			}else{

				removeFile(file);
			}

		});

	}catch(e){

		fs.watchFile(file, function (curr, prev) {

			if(path.existsSync(file)){
				changeFile(file);
			}else{

				removeFile(file);
			}

		});

	}

};

/**
 * 文件改变时
 *
 */
function changeFile(file){

	logger.debug('change file: ${n}',{n: file.replace(/^.*[\/\\](.+)$/gmi,'$1')});

	self.callback && self.callback('change',file);

}

/**
 *
 * 文件被删除时，包括重命名
 *
 */
function removeFile(file){

	logger.debug('remove file: ${n}',{n: file.replace(/^.*[\/\\](.+)$/gmi,'$1')});

	self.callback && self.callback('remove',file);

}
