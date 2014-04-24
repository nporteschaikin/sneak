var Compiler = require('./compiler')
  , fs = require('fs')
  , path = require('path');

var Sneak = {

  render: function (str, locals, options) {
    var compiler = new Compiler(str, options);
    return compiler.compile(locals);
  },

  renderFile: function (opts) {
    if (!opts) opts = {}
    if (!opts.encoding) opts.encoding = 'utf8';
    return Sneak.render(fs.readFileSync(opts.path, opts.encoding), opts.locals, {basepath: path.dirname(opts.path), encoding: opts.encoding});
  }

}

module.exports = Sneak;
