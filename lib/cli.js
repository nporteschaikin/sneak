var sneak = require('..')
  , fs = require('fs')
  , path = require('path');

var Cli = module.exports = function Cli(args) {
  this.path = args.slice(0)[0];
  this.args = args.slice(1);
  this.in = [];
  this.out = [];
  this.get();
}

Cli.prototype = {

  get: function () {
    this.stats = fs.lstatSync(this.path);
    if (this.stats.isFile()) {
      this.buffer(this.path);
    } else if (this.stats.isDirectory()) {
      var files
        , file;
      files = fs.readdirSync(this.path);
      for (var x=0;x<files.length;x++) {
        file = path.join(this.path, files[x]);
        this.buffer(file);
      }
    }
  },

  buffer: function (path) {
    this.in.push({
      path: path,
      content: fs.readFileSync(path, 'utf8')
    })
  },

  save: function (path, str) {
    this.out.push({
      path: path,
      content: this.render(str, path)
    })
  },

  exec: function () {
    if (!this.args.length) {
      this.none();
    } else {
      for (var x=0;x<this.args.length;x++) {
        var peek = this.args[x+1];
        switch (this.args[x]) {
        case "--out":
        case "-o":
          this.output(peek);
          break;
        default:
          this.none();
        }
      }
    }
    this.write();
  },

  output: function (base) {
    this.files(function (p, content) {
      if (this.in.length > 2) base = path.join(base, path.basename(p));
      this.save(base, content);
    }.bind(this));
  },

  write: function () {
    for (var x=0; x<this.out.length; x++) {
      if (this.out[x].path) {
        fs.writeFileSync(this.out[x].path, this.out[x].content);
      } else {
        output(this.out[x].content);
      }
    }
  },

  files: function (fn) {
    for (var x=0; x<this.in.length; x++) {
      fn.call(this, this.in[x].path, this.in[x].content);
    }
  },

  none: function (loc, content) {
    this.files(function (path, content){
      this.save(null, content);
    })
  },

  render: function (str, basepath) {
    try {
      return sneak.render(str, {basepath: basepath});
    } catch (err) {
      throw err;
    }
  }

}

function output(str) {
  console.log(str);
}
