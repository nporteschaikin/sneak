var Lexer = require('./lexer');

var Parser = module.exports = function Parser(str) {
  this.str    = str
  this.lexer  = new Lexer(this.str)
}

Parser.prototype = {

  parse: function () {
    this.lexer.exec()
  },

  advance: function () {
    this.lexer.advance()
  }

}
