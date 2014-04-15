var Lexer = module.exports = function Lexer(str) {
  this.tokens = []
  this.str = str
    .replace(/\r\n|\r/g, '\n');
}

Lexer.prototype = {

  token: function (type, value) {
    return {
      type: type
      , value: value
    }
  },

  exec: function () {
    while (!this.eos()) {
      this.next();
    }
  },

  eos: function () {
    return this.str.length == 0
  },

  next: function () {
    return this.indent()
      || this.interpolation()
      || this.text()
      || this.scan(/^- ?(.*)/, 'block')
      || this.scan(/^(\w[-:\w]*)(\/?)/, 'tag')
      || this.scan(/^\.([\w-]+)/, 'class')
      || this.scan(/^#([\w-]+)/, 'id')
      || this.scan(/^\n *\n/, 'blank')
  },

  scan: function (regexp, type) {
    var capture;
    if (capture = regexp.exec(this.str)) {
      this.consume(capture[0].length)
      return this.push(type, capture[1])
    }
  },

  push: function (type, value) {
    this.tokens.push(this.token(type, value))
  },

  consume: function (n) {
    this.str = this.str.substring(n);
  },

  indent: function () {
    var capture,
      regexp;

    if (!this.indentRegexp) {
      regexp = /^\n(\t*) */
      if (!regexp.exec(this.str)) regexp = /^\n( *)/;
      this.indentRegexp = regexp
    }

    if (/\n/.test(this.str[0])) {
      this.push('newline', null);
    }

    this.scan(this.indentRegexp, 'indent');
  },

  text: function () {
    return this.scan(/^(<[^\n]*)/, 'text')
      || this.scan(/^(?:\| ?| )([^\n]+)/, 'text');
  },

  interpolation: function () {
    if (/^#\{/.test(this.str)) {
      console.log("test");
    }
  },

  unknown: function () {
    throw(new Error("Invalid syntax"))
  }

}
