var Lexer = require('./lexer');

var Parser = module.exports = function Parser(str) {
  this.lexer = new Lexer(str);
  this.tokens = this.lexer.exec();
  this.buf = [];
}

var DOCTYPES = {
  '5': '<!DOCTYPE html>',
  'xml': '<?xml version="1.0" encoding="utf-8" ?>',
  'default': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
  'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
  'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
  '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
  'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
  'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
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

  doctype: function () {
    var doctype = this.advance().value
      .trim()
      .toLowerCase();
    if (doctype in DOCTYPES) {
      this.buffer(DOCTYPES[doctype]);
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
