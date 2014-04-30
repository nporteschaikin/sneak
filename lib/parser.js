var Lexer = require('./lexer')
  , Doctypes = require('./doctypes')
  , fs = require('fs')
  , path = require('path');

var Parser = module.exports = function Parser(str, options) {
  this.options = options;
  this.lexer = new Lexer(str);
  this.tokens = this.lexer.exec();
  this.buf = [];
};

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

  add: function (parser) {
    this.buf = this.buf.concat(parser.parse().buf);
  },

  doctype: function () {
    var doctype = this.advance().value
      .trim()
      .toLowerCase();
    if (doctype in Doctypes) {
      this.buffer(Doctypes[doctype]);
    } else {
      throw new Error("Doctype not found");
    }
  },

  tag: function () {

    var tag = this.advance().value
      , close;
    this.buffer('<' + tag + this.attrs());

    if (this.peek().type == 'close') {

      this.buffer(' />');
      this.advance();

    } else {

      this.buffer('>');

      switch (this.peek().type) {
      case 'text':
        this.text();
        break;
      case 'variable':
        this.variable();
        break;
      case 'local':
        this.local();
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

    }

  },

  text: function () {
    var text = escape(this.advance().value)
      .trim()
      .replace(/#\{(.*)!\}/, locals('$1'))
      .replace(/#\{(.*)\}/, '{$1}');
    this.buffer(text);
  },

  local: function () {
    var lo = this.advance().value;
    this.buffer(locals(lo));
  },

  dot: function () {
    this.advance();
    if (this.peek().type == 'indent') {
      this.advance();
      while (this.peek().type !== 'outdent' && this.peek().type !== 'eos') {
        switch (this.peek().type) {
        case "newline":
          this.buffer(" ");
          break;
        default:
          this.buffer(escape(this.peek().match));
        }
        this.advance();
      }
      if (this.peek().type == 'outdent') {
        this.advance();
      }
    } else {
      throw new Error("Indent must follow dot");
    }
  },

  attrs: function () {
    var attrs = []
      , classes = []
      , buffer = []
      , output = [];

    while (this.peek().type == 'attrs' || this.peek().type == 'id' || this.peek().type == 'class') {
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
      return " " + output.join(" ").replace(/"/g, '\\"');
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
    default:
      throw new Error('A block must be followed by an indent');
    }

    this.buffer('{/block:' + block.value + '}');
  },

  include: function () {
    var include = this.advance();
    var filepath = path.resolve(this.options.basepath, include.value)
      , str = fs.readFileSync(filepath, this.options.encoding)
      , parser = new Parser(str, path.dirname(filepath));

    this.add(parser);
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
    case 'local':
      this.local();
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
      throw new Error("Unexpected " + this.peek().type);
    }
  },

  js: function () {
    return 'return "' + this.buf.join('') + '";'
  },

  parse: function () {
    while (this.peek().type !== 'eos') {
      this.expression();
    }
    return this;
  }

};

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function locals(lo) {
  return '" + (locals.' + lo + ' || "") + "';
}
