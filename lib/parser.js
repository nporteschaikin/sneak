var Lexer = require('./lexer')

var Parser = module.exports = function Parser(str) {
  lexer = this.lexer = new Lexer(str);
  this.tokens = lexer.exec();
  this.buf = [];
}

Parser.prototype = {

  peek: function () {
    return this.tokens[0];
  },

  buffer: function (str) {
    this.buf.push(str);
  },

  advance: function () {
    return this.current = this.tokens.shift();
  },

  tag: function () {
    var tag = this.advance().value;
    this.buffer('<' + tag + '>');
    switch (this.peek().type) {
    case 'attrs':
      this.attrs();
      break;
    case 'text':
      this.text();
      break;
    case 'indent':
      this.nested();
      break;
    }
    this.buffer('</' + tag + '>');
  },

  space: function () {
    this.advance();
  },

  text: function () {
    var text = this.advance().value.trim();
    this.buffer(text);
  },

  attrs: function () {
    this.advance();
  },

  identifier: function () {
    // this.tokens.push(this.lexer.token('tag', this.peek().line))
  },

  nested: function () {
    this.advance();
    while (this.peek().type !== 'outdent' && this.peek().type !== 'eos') {
      this.expression();
    }
    if (this.peek().type == 'outdent') {
      return this.advance();
    }
  },

  expression: function () {
    switch (this.peek().type) {
    case 'indent':
    case 'outdent':
    case 'newline':
      this.space();
      break;
    case 'block':
      this.block();
      break;
    case 'tag':
      this.tag();
      break;
    case 'id', 'class':
      this.identifier();
      break;
    case 'text':
      this.text();
      break;
    default:
      // throw new Error('test');
    }
  },

  parse: function () {
    console.log(this.tokens);
    while (this.peek().type !== 'eos') {
      this.expression();
    }
  }

}
