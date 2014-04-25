var Lexer = require("./lexer")
  , Parser = require("./parser")
  , Compiler = require('./compiler')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore');

module.exports = {

  Lexer: Lexer,
  Parser: Parser,
  Compiler: Compiler,

  render: function (source, options) {
    options = opts(options);
    var compiler = new this.Compiler(source, options);
    return compiler.compile()(options);
  },

  renderFile: function (filename, options) {
    options = opts(options, filename);
    return this.render(fs.readFileSync(filename, options.encoding), options);
  },

  compile: function (source, options) {
    var compiler = new this.Compiler(source, opts(options));
    return compiler.compile();
  },

  compileFile: function (filename, options) {
    options = opts(options, filename);
    return this.compile(fs.readFileSync(filename, options.encoding), options);
  }

};

function opts(options, filename) {
  var defaults = { encoding: 'utf8', basepath: __dirname };
  if (filename) { defaults.basepath = path.dirname(filename); }
  return _.defaults((options || {}), defaults);
}
