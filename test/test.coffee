cli = new (require '../lib/cli')(debug: true)

describe 'api', ->

  it 'should expose render and renderFile', ->
    Sneak.render.should.be.a 'function'
    Sneak.renderFile.should.be.a 'function'

  describe 'render', ->

    it 'should fail to compile with a non-sneak string', ->
      (-> Sneak.render('<html><head></head></html>')).should.throw()

    it 'should compile with a sneak string', ->
      (-> Sneak.render('!5\nhtml\n  head')).should.not.throw()

    it 'should render with specified local', ->
      Sneak.render('!5\nhtml\n  head\n    title #{foo!}', {foo: "bar"}).indexOf("bar").should.be.gt(-1)

    it 'should render with specified include', ->
      Sneak.render('!5\nhtml\n  head\n  body\n    = "include.sneak"', {}, {basepath: path.join(base_path, 'render')}).indexOf("h1").should.be.gt(-1)

  describe 'renderFile', ->

    it 'should throw error with an invalid path', ->
      (-> Sneak.renderFile({path: "ack"})).should.throw()

    it 'should not throw error if file exists', ->
      (-> Sneak.renderFile({path: path.join(base_path, 'renderFile/file.sneak')})).should.not.throw()

    it 'should throw error if include references path which does not exist', ->
      (-> Sneak.renderFile({path: path.join(base_path, 'renderFile/missing_include.sneak')})).should.throw()

    it 'should render include', ->
      Sneak.renderFile({path: path.join(base_path, 'renderFile/include.sneak')}).should.eq("<!DOCTYPE html>")

    it 'should render', ->
      Sneak.renderFile({path: path.join(base_path, 'renderFile/render.sneak')}).should.eq("<!DOCTYPE html><html><head><title>Test</title></head><body><p>Hey</p></body></html>")

describe 'doctypes', ->

  it 'should correctly render html5 doctype', ->
    render('doctypes/5.sneak').should.equal('<!DOCTYPE html>')

describe 'cli', ->

  describe 'render', ->

    it 'fails with no path', ->
      (-> cli.run('render')).should.throw()

    it 'fails with invalid path', ->
      cli.run('render foo').code.should.equal('ENOENT')

    it 'returns when path is valid', ->
      p = path.join(base_path, 'doctypes/5.sneak')
      cli.run("render #{p}").should.equal('<!DOCTYPE html>')
