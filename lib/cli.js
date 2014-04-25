var sneak = require('..')
  , fs = require('fs')
  , path = require('path');

var lstat = fs.lstatSync
  , read = fs.readFileSync
  , write = fs.writeFileSync
  , tree = fs.readdirSync
  , mkdir = fs.mkdirSync
  , exists = fs.existsSync
  , join = path.join
  , dirname = path.dirname
  , basename = path.basename
  , resolve = path.resolve;

var cli = module.exports = function cli (args) {
  this.opts = args;
};

cli.prototype = {

  exec: function () {
    if (this.opts.paths.length) {
      for (var x = 0; x < this.opts.paths.length; x++) {
        this.render(this.opts.paths[x]);
      }
    }
  },

  render: function (path) {
    var stats = lstat(path);
    if (stats.isFile() && /\.sneak$/.test(path)) {
      var file = read(path)
        , basepath = outpath(path, this.opts)
        , dirpath = dirname(basepath);
      if (!exists(dirpath)) mkdir(dirpath);
      if (this.opts.client) {
        write(basepath, sneak.compile(file, { basepath: dirname(path) }), { flags: "w" });
      } else {
        write(basepath, sneak.render(file, { basepath: dirname(path) }), { flags: "w" });
      }
    } else if (stats.isDirectory()) {
      var dir = tree(path);
      for (var x = 0; x < dir.length; x++) {
        this.render(join(path, dir[x]));
      }
    }

  }

};

function outpath(path, options) {
  path = path.replace(/\.sneak$/, extension(options));
  if (options.out) path = join(options.out, basename(path));
  return resolve(path);
};

function extension(options) {
  if (options.extension) {
    return options.extension;
  } else if (options.client) {
    return '.js';
  } else {
    return '.html';
  }
}
