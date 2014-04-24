var Parser = require('./parser');

var Compiler = module.exports = function Compiler(str, options) {
  this.parser = new Parser(str, options);
  this.parser.parse();
}

Compiler.prototype = {

  compile: function () {
    return new Function(this.parser.js())();
  }

}
