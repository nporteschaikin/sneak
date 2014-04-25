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
    var compiler;
    options = _.defaults((options || {}), defaults());
    compiler = new this.Compiler(source, options);
    return compiler.compile()(options);
  },

  renderFile: function (filename, options) {
    options = _.defaults((options || {}), defaults(filename));
    return this.render(fs.readFileSync(filename, options.encoding), options);
  },

  compile: function (source, options) {
    var compiler;
    options = _.defaults((options || {}), defaults());
    compiler = new this.Compiler(source, options);
    return compiler.compile();
  },

  compileFile: function (filename, options) {
    options = _.defaults((options || {}), defaults(filename));
    return this.compile(fs.readFileSync(filename, options.encoding), options);
  }

};

function defaults (filename) {
  var obj = { encoding: 'utf8', basepath: __dirname };
  if (filename) { obj.basepath = path.dirname(filename); }
  return obj;
}
