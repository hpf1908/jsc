/**
 * jsc：把模板转换成js，合并js
 * @author flyhuang
 */

var logger      = require('./logger')(__filename),
    fs          = require('fs'),
    util        = require('./util'),
    config      = require('./config'),
    program     = require('commander'),
    watcher     = require('./watcher'),
    jsc         = require('./jsc'),
	undefined;

program
  .version('2.0.0')
  .option('-m, --module [folder]', 'the module should be parse')
  .option('-l, --listen [boolean]', 'watch file changed' , 'yes')
  .option('-r, --recurse [flag]', 'recurse read the files')
  .option('-s, --source [foldername]', 'set the source folder [src]', 'src')
  .parse(process.argv);


var compileFolder= function(folder, options){

    var ourputFolder = folder ,
        inputFolder = ourputFolder + '/' + options.source;

    var outputIndex = ourputFolder + '/'+ options.allfile + '.js';
    var outputJs = ourputFolder + '/'+ options.jsfile + '.js';
    var outputTmpl = ourputFolder + '/'+ options.allfile + '.js';


     jsc.createAll(inputFolder , {
        mname       : options.mname,
        jsTarget    : outputJs,
        tmplTarget  : outputTmpl,
        indexTarget : outputIndex
     });

    if(options.listen == 'yes') {
      watcher.watch(inputFolder , function(type , file){
          jsc.createAll(inputFolder , {
              mname       : options.mname,
              jsTarget    : outputJs,
              tmplTarget  : outputTmpl,
              indexTarget : outputIndex
          });
          logger.info(type + ':' + file);
      });
    }

    if(options.recurse) {
      var files = fs.readdirSync(ourputFolder);

      files.forEach(function(name, i){
        if(name!=options.source &&fs.statSync(ourputFolder + '/' + name).isDirectory()){
          compileFolders(ourputFolder + '/' + name , options);
        }
      });
    }
}

var compileFolders = function(folder , options){

  options = util.extend({
    jsfile   : 'js',
    tmplfile : 'tmpl',
    allfile  : 'index',
    mname    : './tmpl'
  },options);

  var inputFolder = folder + '/' + options.source;

  if(fs.existsSync(inputFolder)){
    compileFolder(folder , options);
  } else {
    logger.info('not exist source folder : ${folder}', { folder : inputFolder});
  }
}

/**
 * @todo 支持自定义模板
 * @todo 复制子文件到上层文件
 * @todo 容错提示
 * @todo 压缩
 */
if (program.module) {

  var folder = config.seajsRoot + program.module;

  options = {
    listen : program.listen,
    source : program.source,
    recurse: program.recurse
  }

  compileFolders(folder , options);

  if(options.listen!='yes') {
   logger.info('success create all files: ${folder}', { folder : folder});
  }
  
} else {
  logger.warn('should add module , example : node jsc -m modele/feed');
}





