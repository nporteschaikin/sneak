var Lexer = module.exports = function Lexer(str) {
  this.tokens = []
  this.str = str
}

Lexer.prototype = {

  token: function (type, value) {
    return {
      type: type
      , value: value
    }
  },

  next: function () {
    return this.indent()
      || this.newline()
      || this.ex(/^\n *\n/, 'blank')
      || this.ex(/^(\w[-:\w]*)(\/?)/, 'tag')
      || this.ex(/^#([\w-]+)/, 'id')
      || this.ex(/^\.([\w-]+)/, 'class')
      || this.ex(/^(?:\| ?| )([^\n]+)/, 'text')
      || this.ex(/^(<[^\n]*)/, 'text')
      || this.unknown()
  },

  ex: function (regexp, type) {
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
    this.ex(this.indentRegexp, 'indent')
  },

  newline: function () {
    var capture
    if (capture = /\n/.exec(this.str)) {
      return this.push("newline", capture[0])
    }
  },

  unknown: function () {
    throw(new Error("Invalid syntax"))
  }

}
