cli = new (require '../lib/cli')(debug: true)

describe 'api', ->

  it 'should expose render and renderFile', ->
    Sneak.render.should.be.a 'function'
    Sneak.renderFile.should.be.a 'function'

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
