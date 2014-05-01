var Lexer = module.exports = function Lexer(str) {
  this.tokens = [];
  this.line = 1;
  this.indented = 0;
  this.str = String(str)
    .trim()
    .replace(/\r\n|\r|\n *\n/g, '\n');
};

Lexer.prototype = {

  exec: function () {
    while (this.str.length) {
      this.next();
    }
    this.push('eos', this.line);
    return this.tokens;
  },

  token: function (type, line, match, value) {
    return {
      type: type
      , line: line
      , match: match
      , value: value
    };
  },

  push: function (type, line, match, value) {
    this.tokens.push(this.token(type, line, match, value));
  },

  scan: function (regexp, type, callback) {
    var captures
      , token;
    if (captures = regexp.exec(this.str)) {
      this.str = this.str.substr(captures[0].length);
      if (typeof callback == 'function') {
        callback.call(this, captures);
      } else {
        this.push(type, this.line, captures[0], captures[1]);
      }
      return true;
    }
  },

  unknown: function () {
    throw new Error('Invalid text: ' + this.str.substr(0, 5));
  },

  next: function () {
    return this.scan(/^\n( *)(?! *-#)/, 'indent', this.indent)
      || this.scan(/^![]?([^\n]*)/, 'doctype')
      || this.scan(/^\- (\w+)*:/, 'block')
      || this.scan(/^\= \"(\w.*)\"/, 'include')
      || this.scan(/^\= (\w.*)!/, 'local')
      || this.scan(/^\= (\w.*)/, 'variable')
      || this.scan(/^\((.*)\)/, 'attrs')
      || this.scan(/^([a-zA-Z][a-zA-Z0-9:]*)/, 'tag')
      || this.scan(/^\.([\w\-]+)/, 'class')
      || this.scan(/^\#([\w\-]+)/, 'id')
      || this.scan(/^\./, 'dot')
      || this.scan(/^\//, 'close')
      || this.scan(/^(?:\| ?| )([^\n]+)/, 'text')
      || this.unknown();
  },

  indent: function (captures) {
    var indents = captures[1].length / 2;
    this.line++;
    if (indents % 1) {
      throw new Error('Invalid indentation at line ' + this.line);
    } else if (this.indented > indents) {
      while (this.indented-- > indents) {
        this.push("outdent", this.line);
      }
    } else if (this.indented !== indents) {
      this.push("indent", this.line);
    } else {
      this.push("newline", this.line);
    }
    this.indented = indents;
  }

};
