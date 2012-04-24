/**
* @fileOverview 合并js
* @author Viktor Li
* @version
* @requires jQuery
* @update
*/

var Config = {
	dirRule:/(.*)(?:\.)src$/i,	 //需要合并的目录规则,$1为合并后的JS文件名,（目前规则：以.src结尾的目录，不包含src目录）包含src的正则：/(.*)(?:\.|^)src$/
	ignoreRule:/\.ignore\b/i,	//需要忽略不合并的文件名
	defaultName:'index'	 //如果没有目标文件名称，默认使用该名称
};

var logger		= require('./logger')(__filename),
	G_Config		= require('./config.js'),
	watcher		= require('./watcher.js'),
	fs			= require("fs"),
	path		= require('path'),
	undefined;

this.do = function (root,setting) {
	setting = setting || {};
	var subPaths = fs.readdirSync(root),	//子目录
		 conf = Config,
		 dirRule = conf.dirRule,
		 defName = conf.defaultName,
		 paths = [],
		 that = this,
		 setting_root = setting.root,
		 setting_targetName = setting.targetName;//后面的循环会写入该值，先备份

	subPaths.forEach(function (val, index, array) {
		var ma = val && val.match(dirRule),
			 targetName = ma && (ma[1] || conf.defaultName),
			 p = path.join(root,val);
		if(!targetName || !fs.statSync(p).isDirectory()) {
			return false;
		}
		paths.push(p);

		setting.targetName = setting_targetName || targetName || '';
		setting.root = setting_root;
		that.folder(p,null,setting);
	});
	setting.targetName = setting_targetName;
	setting.root = setting_root;

	if(paths && paths.length>0) {
		watcher.watch(paths,function (event,file) {
			that.do(root,setting);
		});
	}
};

/** 把指定文件夹内的js合并成一个js
 * @param root {String} 需要合并的文件夹
 * @param [targetRoot] {String} 合并后的js文件放置目录,默认是root的上一级
 * @param [setting] {Object}
 */
this.folder = function (root,targetRoot,setting) {
	setting = setting || {};
	targetRoot = targetRoot || root.replace(/([\/\\])[^\/\\]*[\/\\]?$/,'$1');	//自定义或者root的上一级目录
	var files = fs.readdirSync(root),
		 conf = Config,
		 dirRule = conf.dirRule,
		 ma = root && root.replace(/[]/,'').match(dirRule),
		 targetName = setting.targetName || (ma && (ma[1] || conf.defaultName));

	if(!targetName) {return false;}
	setting.root = setting.root || root;
	this.merge(files,targetRoot,targetName,setting);
};
/**
 * @param filelist {Array} 文件列表
 * @param targetRoot {String}
 * @param [setting] {Object} 设置
 * root:filelist文件列表的路径
 */
this.merge = function (filelist,targetRoot,targetName,setting) {
	setting = setting || {};
	targetRoot = targetRoot || __dirname;
	targetName = targetName.replace(/(\.js)?\s*$/,'.js');
	var root = setting.root || __dirname,	//默认dirname
		 seajsRoot = setting.seajsRoot || path.resolve(__dirname,G_Config.seajsRoot),
		 ignoreRule = Config.ignoreRule,
		 res = [],
		 moduleStr = 'define(function(require){return require;});\r\n',
		 source = [];

	//按文件名排序
	filelist.sort(function(a,b){
		return a >= b ? 1 : -1;
	});

	filelist.forEach(function (fileName,index) {
		var p = path.join(root,fileName),
			 str,
			 dependent = [];
		//排除非js文件、需要忽略的文件
		if(!/\.js$/i.test(fileName) || (ignoreRule && ignoreRule.test(fileName)) || !fs.statSync(p).isFile()) {
			return false;
		}

		//检测是否重写了合并后的文件
		fileName = fileName.replace(/(\.js)?\s*$/,'.js');
		if(fileName === targetName){
			moduleStr = '';
		}

		//模块标识，用在seajs define
		var mname = targetRoot.slice(seajsRoot.length + 1).replace(/[\\\/]$/,'') + '/' + fileName.replace(/\.js$/i,'');
		//兼容windows版本
		mname = mname.replace(/\\/g,'/');

		str = fs.readFileSync(p,'UTF-8');
		//去除utf-8文件头的BOM标记
		str = str.replace(/^[\ufeff\ufffe]/,'');
		//扫描依赖关系
		str.replace(/require\(\W*[\'\"]([^\'\" ]+?)[\'\"]\W*\)/gmi,function($0,id){
			dependent.push(id);
		});

		str = str.replace(/(define\()[\W]*?(function)/gm,'$1"' + mname + '",' + JSON.stringify(dependent) + ',$2');

		res.push(str,'\r\n');
		var showRoot = p.slice(seajsRoot.length + 1);
		showRoot = showRoot.replace(/\\/g,'/');	//统一斜杠
		source.push(showRoot);
	});

	res.push(G_Config.afterJS);
	res.unshift(G_Config.beforeJS);
	res.unshift(moduleStr);

	//文件头部标识源文件路径
	res.unshift('\r\n\/* sources: \r\n * '+source.join(' \r\n * ')+'\r\n*\/\r\n');

	if(res.length>0) {
		var target = path.join(targetRoot,targetName),
			 content = res.join('\r\n');
		//启用windows换行
		content = content.replace(/\r\n/g,'\n').replace(/\n/g,'\r\n');

		fs.writeFileSync(target,content,'UTF-8');
	}else{
		logger.info('${o} is empty!!!',{o : root});
	}
};