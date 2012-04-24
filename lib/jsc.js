
/**
 * jsc：把模板转换成js，合并js
 * @author youkunhuang
 *
 */


var logger		= require('./logger')(__filename),
	config		= require('./config.js'),
	watcher		= require('./watcher.js'),
	parse		= require('./parse.js'),
	Queue		= require('./queue.js'),
	ComboJS 	= require('./comboJS.js'),
	q			= new Queue(),
	fs			= require("fs"),
	path		= require('path'),
	outputALL	= config.outputALL,
	outputJS	= config.outputJS,
	outputHTML	= config.outputHTML,
	jscTimes	= 0,
	undefined;

module.exports = jsc;

/**
 * 合并文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 */
function jsc(opt){

	var seajsRoot = opt.seajsRoot,
		modulePath = opt.modulePath,
		callback = opt.callback,
		listen = opt.listen,
		undefined;
	
	if(!path.existsSync(modulePath)){
		callback && callback();
		return;
	}
	
	ComboJS.do(modulePath);	//合并自定义file name的js目录

	if(!path.existsSync(modulePath + '/src')){
		callback && callback();
		return;
	}

	q.queue(function(){
		this.clear();
		createALL(seajsRoot,modulePath);
		parseHTML(seajsRoot,modulePath);
		logger.info('finish! ' + (++jscTimes));
		callback && callback();
		this.dequeue();
	});


	listen &&
	watcher.watch(modulePath + '/src',function(event,file){

		var filename = file.slice(modulePath.length + 1);

		if(
			filename !== outputALL &&
			filename !== outputJS &&
			filename !== outputHTML
		){

			logger.info('${e} : ${f}',{
				e: event,
				f: filename
			});

			q.queue(function(){
				createALL(seajsRoot,modulePath);
				parseHTML(seajsRoot,modulePath);
				logger.info('finish! ' + (++jscTimes));
				this.dequeue();
			});
		}

	});

}

/**
 *
 * 合并所有文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 */
function createALL(seajsRoot,modulePath){

	var js = [],
		res = [],
		resJS = [],
		resHTML = [],
		out = modulePath.slice(seajsRoot.length + 1) + '/' + outputALL,
		moduleStr = 'define(function(require){return require;});\r\n',
		tmp,i,str,mname;

	resJS = createJS(seajsRoot,modulePath);
	resHTML = createHTML(seajsRoot,modulePath);

	logger.info('${o}:',{
		o: out
	});

	if(path.existsSync(modulePath + '/src/' + outputALL)){
		moduleStr = '';
	}

	[].push.apply(res,resJS);
	[].push.apply(res,resHTML);

/*
	js.push(outputJS,outputHTML);

	js.forEach(function(n,i){

		mname = modulePath.slice(seajsRoot.length + 1) + '/' + n.replace(/\.js$/i,'');
		mname = mname.replace(/\\/g,'/');

		logger.info('    ${m}  <--  ${n}',{ n: n, m: mname});

		try{

			str = fs.readFileSync(modulePath + '/' + n,'UTF-8');
			//去除utf-8文件头的BOM标记
			str = str.replace(/^[\ufeff\ufffe]/,'');
			str = str.replace(/\r\n|\r|\n/gmi,"\r\n");
			
			res.push(str,'\n');

		}catch(e){
		}


	});
*/

	if(res.length){
		fs.writeFileSync(
			modulePath + '/' + outputALL,
			moduleStr + res.join(''),
			'UTF-8'
		);
	}else{
		logger.info('${o} is empty!!!',{o : out});
	}

}

/**
 *
 * 编译模板文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 */
function parseHTML(seajsRoot,modulePath){

	var js = [],
		res = [],
		idmap = {},
		tmp,i,str,mname;

	tmp = fs.readdirSync(modulePath + '/src');

	tmp.forEach(function(n,i){
		if(
			//n !== outputALL &&
			//n !== outputJS &&
			//n !== outputHTML &&
			/\.page.html?$/i.test(n) &&
			fs.statSync(modulePath + '/src/' + n).isFile()
		){
			js.push(n);
		}

	});
	
	//按文件名排序
	js.sort(function(a,b){
		return a >= b ? 1 : -1;
	});

	logger.info('parse ${o}:',{
		o: modulePath.slice(seajsRoot.length + 1) + '/'
	});

	js.forEach(function(n,i){

		var res;

		mname = n.replace(/\.page(\.html?)$/,'$1');

		logger.info('parse:     ${m}  <--  ${n}',{ n: n, m: mname});

		res = parse({
			file: modulePath + '/src/' + n,
			path: modulePath + '/src',
			seajsRoot: seajsRoot
		});

		if(res){
			fs.writeFileSync(modulePath + '/' + mname,res.result,'UTF-8');
		}
	});


}


/**
 *
 * 合并模板文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 */
function createHTML(seajsRoot,modulePath){

	var js = [],
		res = [],
		idmap = {},
		out = modulePath.slice(seajsRoot.length + 1) + '/' + outputHTML,
		tmp,i,str,mname;

	tmp = fs.readdirSync(modulePath + '/src');

	tmp.forEach(function(n,i){
		if(
			//n !== outputALL &&
			//n !== outputJS &&
			//n !== outputHTML &&
			/\.(?:tmpl|page).html?$/i.test(n) &&
			fs.statSync(modulePath + '/src/' + n).isFile()
		){
			js.push(n);
		}

	});
	
	//按文件名排序
	js.sort(function(a,b){
		return a >= b ? 1 : -1;
	});

	logger.info('${o}:',{
		o: out
	});

	mname = modulePath.slice(seajsRoot.length + 1) + '/' + outputHTML.replace(/\.js$/i,'');
	//兼容windows版本路径
	mname = mname.replace(/\\/g,'/');

	res.push('define("', mname ,'",[],function(require, exports, module){\nvar tmpl = { ','\n');

	js.forEach(function(n,i){

		var reg = /<script([^<>]+?)type="text\/html"([\w\W\r\n]*?)>(?:\r\n|\r|\n)?([\w\W\r\n]*?)(?:\r\n|\r|\n)?<\/script>/gmi,
			regCode = /<%(=?)([\w\W\r\n]*?)%>(?:\r\n|\r|\n)?/gmi,
			isID = /id="(.+?)"/i,
			noWith = /nowith="yes"/i,
			exec,jscode,eq,
			id,tmp,code,index,len;

		logger.info('    ${m}  <--  ${n}',{ n: n, m: mname});

		str = fs.readFileSync(modulePath + '/src/' + n,'UTF-8');

		//去除utf-8文件头的BOM标记
		str = str.replace(/^[\ufeff\ufffe]/,'');
		str = str.replace(/\r\n|\r|\n/gmi,"\r\n");

		while(exec  =  reg.exec(str)){

			tmp = exec[0] + exec[1];

			if(!isID.test(tmp)){
				continue;
			}

			id = isID.exec(tmp)[1];

			code = exec[3];

			res.push('\'', id , '\': function(data){\n\nvar __p=[],_p=function(s){__p.push(s)};\n');

			if(!noWith.test(tmp)){
				res.push('with(data||{}){\n');
			}

			//解析模板
			index = 0;

			while(exec  =  regCode.exec(code)){

				len = exec[0].length;

				if(index !== exec.index){
					res.push("__p.push('")
					res.push(
						code
							.slice(index,exec.index)
								.replace(/\\/gmi,"\\\\")
								.replace(/'/gmi,"\\'")
								.replace(/\r\n|\r|\n/gmi,"\\\n")
					);
					res.push("');\n");
				}

				index = exec.index + len;

				eq = exec[1];
				jscode = exec[2];


				if(eq){
					res.push('_p(');
					res.push(jscode);
					res.push(');\n');
				}else{
					res.push(jscode);
				}

			}

			res.push("__p.push('")
			res.push(
				code
					.slice(index)
						.replace(/\\/gmi,"\\\\")
						.replace(/'/gmi,"\\'")
						.replace(/\r\n|\r|\n/gmi,"\\\n")
			);
			res.push("');\n");

			if(!noWith.test(tmp)){
				res.push('\n}');
			}

			res.push('\nreturn __p.join("");\n}' , ',\n\n');

			if(idmap[id]){
				logger.warn('        same id: ${id}',{id: id});
			}

			idmap[id] = id;
		}

	});

	res.length --;

	res.push('\n};\nreturn tmpl;\n});');

	if(js.length){
		fs.writeFileSync(modulePath + '/' + outputHTML,res.join(''),'UTF-8');
	}else{
		logger.info('${o} is empty!!!',{o : out});
	}

	return res;
}


/**
 *
 * 合并js文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 */
function createJS(seajsRoot,modulePath){

	var js = [],
		res = [],
		out = modulePath.slice(seajsRoot.length + 1) + '/' + outputJS,
		moduleStr = 'define(function(require){return require;});\r\n',
		tmp,i,str;
	
	
	if(path.existsSync(modulePath + '/src/' + outputJS)){
		moduleStr = '';
	}

	tmp = fs.readdirSync(modulePath + '/src');

	tmp.forEach(function(n,i){
		if(
			//n !== outputALL &&
			//n !== outputJS &&
			//n !== outputHTML &&
			/\.js$/i.test(n) &&
			fs.statSync(modulePath + '/src/' + n).isFile()
		){
			js.push(n);
		}

	});

	//按文件名排序
	js.sort(function(a,b){
		return a >= b ? 1 : -1;
	});

	logger.info('${o}:',{
		o: out
	});

	res.push(config.beforeJS);

	js.forEach(function(n,i){

		var mname = modulePath.slice(seajsRoot.length + 1) + '/' + n.replace(/\.js$/i,'');

		//兼容windows版本
		mname = mname.replace(/\\/g,'/');
		logger.info('    ${m}  <--  ${n}',{ n: n, m: mname});

		str = fs.readFileSync(modulePath + '/src/' + n,'UTF-8');

		//去除utf-8文件头的BOM标记
		str = str.replace(/^[\ufeff\ufffe]/,'');
		str = str.replace(/\r\n|\r|\n/gmi,"\r\n");

		var dependent = [];

		//扫描依赖关系
		str.replace(/require\(\W*[\'\"]([^\'\" ]+?)[\'\"]\W*\)/gmi,function($0,id){
			dependent.push(id);
		});


		str = str.replace(/(define\()[\W]*?(function)/gm,'$1"' + mname + '",' + JSON.stringify(dependent) + ',$2');

		res.push(str,'\n');


	});

	res.push(config.afterJS);

	if(js.length){
		fs.writeFileSync(
			modulePath + '/' + outputJS,
			moduleStr + res.join(''),
			'UTF-8'
		);
	}else{
		logger.info('${o} is empty!!!',{o : out});
	}
	
	return res;

}





