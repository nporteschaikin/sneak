var Parser = require('./parser');

var Compiler = module.exports = function Compiler(str, options) {
  this.parser = new Parser(str, options);
  this.parser.parse();
}

Compiler.prototype = {

  precompile: function () {
    return new Function('locals', this.parser.js());
  },

  compile: function (locals) {
    return this.precompile()(locals);
  }

}
