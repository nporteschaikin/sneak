var Lexer = require('./lexer');

var Parser = module.exports = function Parser(str) {
  this.str    = str
  this.lexer  = new Lexer(this.str)
}

Parser.prototype = {

  parse: function () {
    while (this.lexer.str.length > 0) {
      this.lexer.next()
    }
    console.log(this.lexer.tokens)
  },

  advance: function () {
    this.lexer.advance()
  }

}
