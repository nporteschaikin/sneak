var Lexer    = require("./compiler");
var Parser   = require("./parser");
var Compiler = require('./compiler');
var fs       = require('fs');
var path     = require('path');
var extend   = require('extend');

module.exports = {

  Lexer: Lexer,
  Parser: Parser,
  Compiler: Compiler,

  render: function (source, options) {
    var options  = extend({ basepath: __dirname }, options);
    var compiler = new this.Compiler(source, options);
    return compiler.compile()(options);
  },

  renderFile: function (filename, options) {
    var options = extend({
      encoding: 'utf8',
      basepath: path.dirname(filename)
    }, options);

    return this.render(fs.readFileSync(filename, options.encoding), options);
  },

  compile: function (source, options) {
    var options  = extend({ basepath: __dirname }, options);
    var compiler = new this.Compiler(source, options);
    return compiler.compile();
  },

  compileFile: function (source, options) {
    var options = extend({
      encoding: 'utf8',
      basepath: path.dirname(filename)
    }, options);

    return this.compile(fs.readFileSync(filename, options.encoding), options);
  }

}
