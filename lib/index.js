/**
 * jsc：把模板转换成js，合并js
 * @author flyhuang
 */

var logger      = require('./logger')(__filename),
    fs          = require('fs'),
    util        = require('./util'),
    config      = require('./config'),
    program     = require('commander'),
    Sync        = require('./sync'),
    jsc         = require('./jsc'),
    compress    = require('../lib/compress'),
	  undefined;

program
  .version('2.0.0')
  .option('-m, --module [folder]', 'the module should be parse')
  .option('-l, --listen [boolean]', 'watch file changed' , 'yes')
  .option('-r, --recurse [flag]', 'recurse read the files' , 'no')
  .option('--source [foldername]', 'set the source folder [src]', 'src')
  .option('--optimized [flag]', 'enable optimized', 'yes')
  .option('--root [seajsroot]', 'set root')
  .option('--compressed [folder]', 'compress folder')
  .option('--target [target]', 'target folder')
  .parse(process.argv);

var checkOptionEnable = function(optionVal){
    return optionVal == 'yes';
}

var compileFolder= function(folder, options){

    var ourputFolder = folder ;
    var inputFolder = options.inputFolder;

    var outputIndex = ourputFolder + '/'+ options.allfile;
    var outputJs = ourputFolder + '/'+ options.jsfile;
    var outputTmpl = ourputFolder + '/'+ options.tmplfile;

    options = util.extend({
        mname       : options.mname,
        jsTarget    : outputJs,
        tmplTarget  : outputTmpl,
        indexTarget : outputIndex,
        jsOnly      : false
    },options);

    if (!options.jsOnly) {
      jsc.createAll(inputFolder , options);
    } else {
      jsc.createJs(inputFolder , options.jsTarget , options);
    }
    
    if(checkOptionEnable(options.listen)) {
      new Sync(ourputFolder , inputFolder , {
        slaveCallback : function(type , file){
          if (!options.jsOnly) {
            jsc.createAll(inputFolder , options);
          } else {
            jsc.createJs(inputFolder , options.jsTarget , options);
          }
          logger.info(type + ':' + file);
        }
      });
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
    options.inputFolder = inputFolder;
    compileFolder(folder , options);
  } else {
    logger.warn('not exist source folder : ${folder}', { folder : inputFolder});
  }

  //附加的js编译目录
  var files = fs.readdirSync(folder);
  var normalFolders = [];

  files.forEach(function(name, i){
    var subFolder = folder + '/' + name;
    var customFolder = config.isCustomCompilesFolder(folder , name);
    if(customFolder){
      var copyOpts = util.extend({},options);
      copyOpts.inputFolder = folder + '/' + name;
      copyOpts.jsfile = customFolder + '.js';
      copyOpts.jsOnly = true;
      compileFolder(folder , copyOpts);
    } else if(name!=options.source && fs.statSync(subFolder).isDirectory()) {
      normalFolders.push(name);
    }
  });

  if(options.recurse) {
    for(var i = 0; i < normalFolders.length; i++){
      var normalFolder = folder + '/' + normalFolders[i];
      compileFolders(normalFolder , options);
    }
  }
}

/**
 * @todo 支持自定义模板
 * @todo 复制子文件到上层文件
 * @todo 容错提示
 * @todo 压缩
 */
if (program.module) {

  if(program.root) {
    config.seajsRoot = program.root;
  }

  var sourcefolder = config.seajsRoot + program.module;  

  if(!program.compressed) {
    options = {
      listen : program.listen,
      source : program.source,
      recurse: checkOptionEnable(program.recurse),
      optimized : checkOptionEnable(program.optimized)
    }

    compileFolders(sourcefolder , options);

    if(checkOptionEnable(options.listen)) {
     logger.info('success create all files: ${folder}', { folder : sourcefolder});
    }
  } else {
    var target = program.target ? program.target : sourcefolder;
    
    if(compress.compressFolder(sourcefolder , target)){
      logger.info('success compress all files: ${folder}', { folder : sourcefolder});
    }
  }
} else {
  logger.warn('should add module , example : node jsc -m modele/feed');
}





