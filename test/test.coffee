cli = new (require '../lib/cli')
path = require 'path'
sneak = require '..'
fs = require 'fs'

__fixtures = path.join(__dirname, 'fixtures')
read = fs.readFileSync
exists = fs.existsSync
rm = fs.unlinkSync
rmdir = fs.rmdirSync

rmIfExists = (path) ->
  rm(path) if exists(path)
  path

describe 'API', ->

  it 'should expose render and renderFile', ->
    sneak.render.should.be.a 'function'
    sneak.renderFile.should.be.a 'function'

  describe '.render()', ->

    it 'should fail to compile with a non-sneak string', ->
      (-> sneak.render('<html><head></head></html>')).should.throw()

    it 'should compile with a sneak string', ->
      (-> sneak.render('!5\nhtml\n  head')).should.not.throw()

    it 'should render with specified local', ->
      sneak.render('!5\nhtml\n  head\n    title #{foo!}', {foo: "bar"}).indexOf("bar").should.be.gt(-1)

    it 'should render with specified include', ->
      sneak.render('!5\nhtml\n  head\n  body\n    = "include.sneak"', {basepath: path.join(__fixtures, 'render')}).indexOf("h1").should.be.gt(-1)

  describe '.renderFile()', ->

    it 'should throw error with an invalid path', ->
      (-> sneak.renderFile("ack")).should.throw()

    it 'should not throw error if file exists', ->
      (-> sneak.renderFile(path.join(__fixtures, 'renderFile/file.sneak'))).should.not.throw()

    it 'should throw error if include references path which does not exist', ->
      (-> sneak.renderFile(path.join(__fixtures, 'renderFile/missing_include.sneak'))).should.throw()

    it 'should render include', ->
      sneak.renderFile(path.join(__fixtures, 'renderFile/include.sneak')).should.eq("<!DOCTYPE html>")

    it 'should render', ->
      sneak.renderFile(path.join(__fixtures, 'renderFile/render.sneak')).should.eq("<!DOCTYPE html><html><head><title>Test</title></head><body><p>Hey</p></body></html>");

  describe '.compile()', ->


  describe '.compileFile()', ->

    it 'should throw error with an invalid path', ->
      (-> sneak.compileFile("ack")).should.throw()

    it 'should not throw error if file exists', ->
      (-> sneak.compileFile(path.join(__fixtures, 'compileFile/file.sneak'))).should.not.throw()

    it 'should return JS', ->
      sneak.compileFile(path.join(__fixtures, 'compileFile/file.sneak')).toString().should.eq('function anonymous(locals) {\nreturn "<h1>Test</h1>";\n}')

describe 'doctypes', ->

  it 'should correctly render html5 doctype', ->
    sneak.render('! 5').should.eq('<!DOCTYPE html>')

describe 'block', ->

  it 'should render a block element', ->
    sneak.render('- Posts:\n  p Hey').should.eq('{block:Posts}<p>Hey</p>{/block:Posts}')

describe 'local', ->

  it 'should render a local', ->
    sneak.render('= foo!', {foo: "bar"}).should.eq('bar')

describe 'variable', ->

  it 'should render a variable', ->
    sneak.render('= foo').should.eq('{foo}')

describe 'attrs', ->

  it 'should render an element with attributes', ->
    sneak.render('html(name: "test")').should.eq('<html name="test"></html>')

describe 'tag', ->

  it 'should render a tag', ->
    sneak.render('div foo').should.eq('<div>foo</div>')

  it 'should render an ID as a div with an ID attr', ->
    sneak.render('#test hey').should.eq('<div id="test">hey</div>')

  it 'should render class selectors as a div with a class attr', ->
    sneak.render('.test.food hey').should.eq('<div class="test food">hey</div>')

  it 'should render interpolated locals in blocks', ->
    sneak.render('div(name: foo!)', {foo: 'bar'}).should.eq('<div name="bar"></div>')

  it 'should render interpolated tags in blocks', ->
    sneak.render('div(name: foo)').should.eq('<div name="{foo}"></div>')

describe 'close', ->

  it 'should self-close', ->
    sneak.render('meta/').should.eq('<meta />');

describe 'text', ->

  it 'should render all content inside a tag with a dot at the end as text', ->
    sneak.render('header.\n  Hey\n  Hey').should.eq('<header>Hey Hey</header>')

  it 'should render a line starting with a bar as text', ->
    sneak.render('| hey').should.eq('hey')

describe 'comment', ->

  it 'should render comments', ->
    sneak.render('header\n  // hello').should.eq('<header><!-- hello --></header>')

describe 'cli', ->

  it 'throws with invalid path', ->
    cli.opts = { paths: ["!@$%^&*()"] }
    (-> cli.exec()).should.throw();

  it 'does not throw with valid path', ->
    cli.opts = { paths: [path.join(__fixtures, "cli/valid_path")] }
    (-> cli.exec()).should.not.throw();

  it 'compiles a file', ->
    p1 = rmIfExists(path.join(__fixtures, 'cli/file/file.html'))

    cli.opts = { paths: [path.join(__fixtures, "cli/file/file.sneak")] }
    cli.exec()

    read(p1, 'utf8').should.eq("<h1>Test</h1>");

  it 'compiles a folder', ->
    p1 = rmIfExists(path.join(__fixtures, 'cli/folder/folder.html'))
    p2 = rmIfExists(path.join(__fixtures, 'cli/folder/folder2.html'))

    cli.opts = { paths: [path.join(__fixtures, "cli/folder")] }
    cli.exec()

    read(p1, 'utf8').should.eq("<h1>Test</h1>");
    read(p2, 'utf8').should.eq("<h1>Test</h1>");

  it 'compiles to another folder', ->
    folder = path.join(__fixtures, 'cli/another_folder/')
    p1 = rmIfExists(path.join(folder, 'folder.html'))
    p2 = rmIfExists(path.join(folder, 'folder2.html'))
    rmdir(folder) if exists(folder)

    cli.opts = { paths: [path.join(__fixtures, "cli/folder")], out: path.join(__fixtures, "cli/another_folder") }
    cli.exec()

    read(p1, 'utf8').should.eq("<h1>Test</h1>");
    read(p2, 'utf8').should.eq("<h1>Test</h1>");

  it 'compiles with specified extension', ->
    p1 = rmIfExists(path.join(__fixtures, 'cli/extension/extension.htm'))

    cli.opts = { paths: [path.join(__fixtures, "cli/extension")], extension: '.htm' }
    cli.exec()

    read(p1, 'utf8').should.eq("<h1>test</h1>");

  it 'compiles a client', ->
    p1 = rmIfExists(path.join(__fixtures, 'cli/client/client.js'))

    cli.opts = { paths: [path.join(__fixtures, "cli/client")], client: true }
    cli.exec()

    fn = new Function("return " + read(p1, 'utf8'));
    fn()({foo: "bar"}).should.eq('<h1>bar</h1><p>Why are we here?</p>');
