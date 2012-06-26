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
  .option('-o, --optimized', 'enable optimized')
  .parse(process.argv);


var compileFolder= function(folder, options){

    var ourputFolder = folder ;
    var inputFolder = ourputFolder + '/' + options.source;

    var outputIndex = ourputFolder + '/'+ options.allfile + '.js';
    var outputJs = ourputFolder + '/'+ options.jsfile + '.js';
    var outputTmpl = ourputFolder + '/'+ options.tmplfile + '.js';

    options = util.extend({
        mname       : options.mname,
        jsTarget    : outputJs,
        tmplTarget  : outputTmpl,
        indexTarget : outputIndex
    },options);

    jsc.createAll(inputFolder , options);
    
    if(options.listen == 'yes') {
      new watcher({
        root : inputFolder,
        callback : function(type , file){
          jsc.createAll(inputFolder , options);
          logger.info(type + ':' + file);
        }
      }).watch();
    }
}

var compileFolders = function(folder , options){

  options = util.extend({
    jsfile   : config.outputJS,
    tmplfile : config.outputHTML,
    allfile  : config.outputALL,
    mname    : './tmpl'
  },options);

  var inputFolder = folder + '/' + options.source;

  if(fs.existsSync(inputFolder)){
    compileFolder(folder , options);
  } else {
    logger.info('not exist source folder : ${folder}', { folder : inputFolder});
  }

  if(options.recurse) {
    var files = fs.readdirSync(folder);

    files.forEach(function(name, i){
      var subFolder = folder + '/' + name;
      if(name!=options.source && fs.statSync(subFolder).isDirectory()){
        compileFolders(subFolder , options);
      }
    });
  }
}

/**
 * @todo 支持自定义模板
 * @todo 复制子文件到上层文件
 * @todo 容错提示
 * @todo 压缩
 */
if (program.module) {

  var sourcefolder = config.seajsRoot + program.module;

  options = {
    listen : program.listen,
    source : program.source,
    recurse: program.recurse,
    optimized : program.optimized
  }

  compileFolders(sourcefolder , options);

  if(options.listen!='yes') {
   logger.info('success create all files: ${folder}', { folder : sourcefolder});
  }
  
} else {
  logger.warn('should add module , example : node jsc -m modele/feed');
}





