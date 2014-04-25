var Lexer = require("./compiler")
  , Parser = require("./parser")
  , Compiler = require('./compiler')
  , fs = require('fs')
  , path = require('path');

module.exports = {

  Lexer: Lexer,
  Parser: Parser,
  Compiler: Compiler,

  render: function (source, options) {
    if (!options) options = {}
    if (!options.basepath) options.basepath = __dirname;
    var compiler = new this.Compiler(source, options);
    return compiler.compile()(options);
  },

  renderFile: function (filename, options) {
    if (!options) options = {}
    if (!options.encoding) options.encoding = 'utf8';
    if (!options.basepath) options.basepath = path.dirname(filename);
    return this.render(fs.readFileSync(filename, options.encoding), options);
  },

  compile: function (source, options) {
    if (!options) options = {}
    if (!options.basepath) options.basepath = __dirname;
    var compiler = new this.Compiler(source, options);
    return compiler.compile();
  },

  compileFile: function (source, options) {
    if (!options) options = {}
    if (!options.encoding) options.encoding = 'utf8';
    if (!options.basepath) options.basepath = path.dirname(filename);
    return this.compile(fs.readFileSync(filename, options.encoding), options);
  }

}
