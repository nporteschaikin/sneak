sneak
=============

Write Tumblr themes locally and painlessly.

### Installation
`npm install sneak -g`
  
### Why should you care?
To quote [@jenius](https://github.com/carrot/carrot-the-company/blob/master/ideas/tumblr-parser.md):

> Tumblr development at the moment is severely painful - you have to write the code without the tumblr tags, then paste it into tumblr to test. Their online text editor is slower, more awkward, and doesn't have the version control and text editing shortcuts we know, love, and rely on.

sneak is a tumblr parser and compiler. Use your favorite template engine (see [accord](http://www.github.com/jenius/accord)) and write your tumblr theme, including locals.  Compile to tumblr's syntax or preview in your browser with public tumblr content.  

### Usage
sneak has two methods: `compile` and `watch`. 

#### compile
```
$ sneak compile index.jade
```

#### watch
```
$ sneak watch .
```
