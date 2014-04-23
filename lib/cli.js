var ArgParse = require('argparse').ArgumentParser,
    EventEmitter = require('events').EventEmitter,
    pkg = require('../package.json'),
    Sneak = require('..')

function CLI(opts){
  if (!opts) opts = {};

  this.emitter = new EventEmitter;
  this.parser = new ArgParse({
    version: pkg.version,
    description: pkg.description,
    debug: opts.debug || false
  });
  var sub = this.parser.addSubparsers();

  $render(sub);
}

CLI.prototype.run = function(args){
  if (typeof args === 'string') args = args.split(' ');
  args = this.parser.parseArgs(args);
  fn = Sneak[args.fn];
  delete args.fn

  try {
    var res = fn(args);
  } catch (err) {
    this.emitter.emit('err', err.stack);
    return err
  }

  this.emitter.emit('data', res);

  return res

}

function $render(sub){
  var s = sub.addParser('render', { help: 'render a sneak template' });
  s.addArgument(['path'], { help: 'path to the file you want to render' });
  s.setDefaults({ fn: 'renderFile' });
}

module.exports = CLI;
