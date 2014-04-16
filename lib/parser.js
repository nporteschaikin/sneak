var Lexer = require('./lexer')

var Parser = module.exports = function Parser(str) {
  this.lexer = new Lexer(str);
  this.tokens = this.lexer.exec();
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
    this.buffer('<' + tag + this.attrs() + '>');
    switch (this.peek().type) {
    case 'text':
      this.text();
      break;
    case 'indent':
      this.nested();
      break;
    }
    this.buffer('</' + tag + '>');
  },

  text: function () {
    var text = this.advance().value
      .trim()
      .replace(/#\{(.*)\}/, '{$1}');
    this.buffer(text);
  },

  attrs: function () {
    var attrs = []
      , classes = []
      , buffer = []
      , output = [];
    while (this.peek().type == 'attrs'
    || this.peek().type == 'id'
    || this.peek().type == 'class') {
      switch (this.peek().type) {
      case 'attrs':
        attrs.push(JSON.parse("{" + attr.value + "}"));
        break;
      case 'id':
        attrs.push({"id": this.peek().value});
        break;
      case "class":
        attrs.push({class: this.peek().value});
        break;
      }
      this.advance();
    }
    for (var a in attrs) {
      for (var b in attrs[a]) {
        if (b == 'class') {
          classes.push(attrs[a][b]);
        } else {
          buffer[b] = attrs[a][b];
        }
      }
    }
    if (classes.length) {
      buffer.class = classes.join(" ");
    }
    for (var x in buffer) {
      output.push(x + '="' + buffer[x] + '"');
    }
    if (output.length) {
      return " "
        + output.join(" ");
    } else {
      return "";
    }
  },

  identifier: function () {
    this.tokens.unshift(this.lexer.token('tag', null, null, 'div'));
    console.log(this.tokens);
  },

  block: function () {
    var block = this.advance();
    this.buffer('{block:' + block.value + '}');
    if (this.peek().type == 'indent') {
      this.nested();
    }
    this.buffer('{/block:' + block.value + '}');
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
    console.log(this.peek().type);
    switch (this.peek().type) {
    case 'indent':
    case 'outdent':
    case 'newline':
      this.advance();
      break;
    case 'block':
      this.block();
      break;
    case 'tag':
      this.tag();
      break;
    case 'id':
    case 'class':
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
    while (this.peek().type !== 'eos') {
      this.expression();
    }
    return this.buf.join('');
  }

}
