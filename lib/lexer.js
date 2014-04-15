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
    return this.ex(/^(\w[-:\w]*)(\/?)/, 'tag')
      || this.ex(/^\n *\n/, 'blank')
      || this.ex(/^#([\w-]+)/, 'id')
      || this.ex(/^\.([\w-]+)/, 'class')
      || this.ex(/^(?:\| ?| )([^\n]+)/, 'text')
      || this.ex(/^(<[^\n]*)/, 'text')
      || this.indent()
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
    var capture;
    if (!this.indentRegexp) {
      regexp = /^\n(\t*) */
      if (!regexp.exec(this.str)) regexp = /^\n( *)/;
      this.indentRegexp = regexp
    }
    this.ex(this.indentRegexp, 'indent')
  }

}
