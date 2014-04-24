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

    it 'should throw error if specified local is undefined', ->
      (-> Sneak.render('!5\nhtml\n  head hello #{bar!}', { foo: "bar" })).should.throw()

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
