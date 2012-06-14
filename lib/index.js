/**
 * jsc：把模板转换成js，合并js
 * @author flyhuang
 */

var logger		= require('./logger')(__filename),
	fs          = require('fs'),
	util        = require('./util'),
	config      = require('./config'),
	program 	= require('commander'),
	watcher     = require('./watcher'),
	jsc 		= require('./jsc'),
	undefined;

program
  .version('2.0.0')
  .option('-m, --module [folder]', 'the module should be parse')
  .option('-l, --listen [boolean]', 'watch file changed' , true)
  .option('-r, --recurse [flag]', 'recurse read the files')
  .option('-s, --source [foldername]', 'set the source folder [src]', 'src')
  .parse(process.argv);

/**
 * @todo 监听目录，递归监听目录
 * @todo 支持自定义模板
 * @todo 复制子文件到上层文件
 * @todo 
 */
if (program.module) {

	var ourputFolder = config.seajsRoot + program.module ,
		inputFolder = config.seajsRoot + program.module + '/' + program.source;

	if(fs.existsSync(inputFolder)){

		var outputIndex = ourputFolder + '/index.js';
		var outputJs = ourputFolder + '/js.js';
		var outputTmpl = ourputFolder + '/tmpl.js';

		jsc.createAll(inputFolder , {
			mname	    : './tmpl',
			jsTarget    : outputJs,
			tmplTarget  : outputTmpl,
			indexTarget : outputIndex
		});

		watcher.watch(inputFolder , function(type , file){
			jsc.createAll(inputFolder , {
				mname	    : './tmpl',
				jsTarget    : outputJs,
				tmplTarget  : outputTmpl,
				indexTarget : outputIndex
			});

			logger.info(type + ':' + file);
		});

	} else {
		logger.info('not exist module : ${module}', { module : program.module});
	}
}





