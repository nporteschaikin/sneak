var ArgParse = require('argparse').ArgumentParser
  , EventEmitter = require('events').EventEmitter
  , Sneak = require('..')
  , pkg = require('../package.json');

var cli = function (options) {
  if (!options) options = {};
  this.emitter = new EventEmitter;
  this.parser = new ArgParse( {
    version: pkg.version,
    addHelp: true,
    description: pkg.description,
    debug: options.debug || false
  } )
  var _ = this.parser.addSubparsers( { addHelp: true } );
  $render(_);
}

cli.prototype = {

  render: function (options) {
    path = options.path;
    delete options.path;
    return Sneak.renderFile(path, options);
  },

  run: function (args) {
    if (typeof args === 'string') args = args.split(' ');
    args = this.parser.parseArgs(args);
    fn = this[args.fn];
    delete args.fn;
    try {
      this.emitter.emit('response', fn(args));
    } catch (error) {
      this.emitter.emit('error', error.stack);
    }
  }

}

function $render (_) {
  var render = _.addParser( 'render', { addHelp: true } );
  render.addArgument( [ 'path' ], { help: "path to the file you'd like to render" } );
  render.setDefaults( { fn: 'render' } );
}

module.exports = cli;
