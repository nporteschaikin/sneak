describe 'api', ->

  it 'should expose render and renderFile', ->
    Sneak.render.should.be.a 'function'
    Sneak.renderFile.should.be.a 'function'

describe 'doctypes', ->

  it 'should correctly render html5 doctype', ->
    render('doctypes/5.sneak').should.equal('<!DOCTYPE html>')
