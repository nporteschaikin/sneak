var Lexer = require('./lexer')
  , Doctypes = require('./doctypes')
  , fs = require('fs')
  , path = require('path');

var Parser = module.exports = function Parser(str, basepath) {
  this.lexer = new Lexer(str);
  this.tokens = this.lexer.exec();
  this.basepath = basepath;
  this.buf = [];
}

Parser.prototype = {

  peek: function () {
    return this.tokens[0];
  },

  advance: function () {
    return this.current = this.tokens.shift();
  },

  buffer: function (str) {
    this.buf.push(str);
  },

  doctype: function () {
    var doctype = this.advance().value
      .trim()
      .toLowerCase();
    if (doctype in Doctypes) {
      this.buffer(Doctypes[doctype]);
    } else {
      // FIXME: throw new Error("no doctype");
    }
  },

  tag: function () {
    var tag = this.advance().value;
    this.buffer('<' + tag + this.attrs() + '>');
    switch (this.peek().type) {
    case 'text':
      this.text();
      break;
    case 'variable':
      this.variable();
      break;
    case 'include':
      this.include();
      break;
    case 'dot':
      this.dot();
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

  dot: function () {
    this.advance();

    if (this.peek().type == 'indent') {
      this.advance();
      while (this.peek().type !== 'outdent'
      && this.peek().type !== 'eos') {
        switch (this.peek().type) {
        case "newline":
          this.buffer("\n");
        default:
          this.buffer(this.peek().value);
        }
        this.advance();
      }
    }
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
        attrs.push(new Function("", "return {"+ this.peek().value +"};")());
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
  },

  block: function () {
    var block = this.advance();
    this.buffer('{block:' + block.value + '}');

    switch (this.peek().type) {
    case 'indent':
      this.nested();
      break;
    case 'text':
      console.log(this.peek().value);
    }

    this.buffer('{/block:' + block.value + '}');
  },

  include: function () {
    var include = this.advance();
    var filepath = path.resolve(this.basepath, include.value)
      , str = fs.readFileSync(filepath, 'utf8')
      , parser = new Parser(str, path.dirname(filepath));

    this.buffer(parser.parse());
  },

  variable: function () {
    var variable = this.advance();
    this.buffer('{' + variable.value + '}');
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
      this.advance();
      break;
    case 'doctype':
      this.doctype();
      break;
    case 'block':
      this.block();
      break;
    case 'include':
      this.include();
      break;
    case 'variable':
      this.variable();
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
