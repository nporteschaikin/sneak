var path = require('path'),
    fs = require('fs'),
    chai = require('chai'),
    Sneak = require('../..'),
    base_path = path.join(__dirname, '../fixtures');

chai.should();

global.path = path;
global.fs = fs;
global.Sneak = Sneak;
global.base_path = base_path;

global.render = function(p){
  return Sneak.renderFile(path.join(base_path, p));
}
