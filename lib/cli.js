var sneak = require('..')
  , fs = require('fs')
  , path = require('path');

var options = [
  {
    name: "out",
    regexp: [
      /--out ([\w.\/]*)/,
      /-o ([\w.\/]*)/
    ],
  }, {
    name: "extension",
    regexp: [
      /--ext ([\w.]*)/,
      /-e ([\w.]*)/
    ]
  }, {
    name: "client",
    regexp: [
      /(--client)/,
      /(--c)/
    ]
  }
]

var cli = module.exports = function cli(process) {
  this.parse(process.argv.slice(2));
}

cli.prototype = {

  parse: function (args) {
    this.options = {};
    var regexp
      , captures;
    args = args.join(" ");
    for (var x=0; x<options.length; x++) {
      regexp = options[x].regexp;
      for (var y=0; y<regexp.length; y++) {
        if (captures = regexp[y].exec(args)) {
          this.options[options[x].name] = captures[1] || true;
          args = args.replace(captures[0], '');
        }
      }
    }
    if (captures = /--?(\w*)/.exec(args)) {
      throw new Error("Invalid argument: " + captures[0]);
    }
    this.paths = args.trim().split(" ");
  },

  exec: function () {
    if (this.paths.length) {
      for (var x=0; x<this.paths.length; x++) {
        this.render(this.paths[x]);
      }
    }
  },

  render: function (pa) {
    var regexp = /\.sneak$/
      , stat = fs.lstatSync(pa)
      , to
      , file
      , files
      , ext
      , dir
      , output;
    if (stat.isFile() && regexp.test(pa)) {
      file = fs.readFile(pa);
      if (this.options.extension) {
        ext = this.options.extension;
      } else if (this.options.client) {
        ext = ".js";
      } else {
        ext = ".html";
      }
      to = pa.replace(regexp, ext);
      if (this.options.out) {
        to = path.join(this.options.out, path.basename(to));
      }
      if (this.options.client) {
        output = sneak.compile(fs.readFileSync(pa, 'utf8'));
      } else {
        output = sneak.render(fs.readFileSync(pa, 'utf8'));
      }
      dir = path.resolve(path.dirname(to));
      fs.mkdir(dir, function (err) {
        fs.writeFileSync(to, output);
      });
    } else if (stat.isDirectory()) {
      files = fs.readdirSync(pa);
      for (var x=0; x<files.length; x++) {
        this.render(path.join(pa, files[x]));
      }
    }
  }

}
