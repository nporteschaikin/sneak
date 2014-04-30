sneak
=============

[![NPM version](https://badge.fury.io/js/sneak.svg)](http://badge.fury.io/js/sneak) [![tests](https://travis-ci.org/nporteschaikin/sneak.png?branch=master)](https://travis-ci.org/nporteschaikin/sneak)

A template engine heavily inspired by [jade](http://www.github.com/visionmedia/jade) and written with Tumblr in mind.  It is a core component of [peak](http://www.github.com/nporteschaikin/peak), a Tumblr development environment.

### Installation
```
$ npm install sneak -g
```

### Why should you care?

Sneak is a template engine that looks familiar to jade users but has been sanded down and re-tooled for Tumblr theme development.  

### Example

```
! 5
html
  head
    - PageTitle:
      title= Title
  body
    header.
      My first Tumblr
    - Posts:
      h1 #{Title}
```
```
h1= Title
p= Content
```
```html
<!DOCTYPE html>
<html>
  <head>
    {block:PageTitle}
      <title>{Title}</title>
    {/block:PageTitle}
  </head>
  <body>
    <header>My first Tumblr</header>
    {block:Posts}
      <h1>{Title}</h1>
    {/block:Posts}
  </body>
</html>
```

### Syntax

#### Blocks:

> A Tumblr {block:} tag

```
- Posts:
  h1 Title
```
```html
{block:Posts}
  <h1>Title</h1>
{/block:Posts}
```

#### Variables:

> A Tumblr {variable} tag.  Can be interpolated within text.

```
h1= Title
p Content: #{content}
```
```html
<h1>{Title}</h1>
<p>Content: {Content}</p>
```

#### Tags:

> HTML tags can be rendered in several different ways.

```
h1 Title
h2.subtitle Subtitle
#content Content
.footer Footer
footer(name: "bottom") Footer #2
```
```html
<h1>Title</h1>
<h2 class="subtitle">Subtitle</h2>
<div id="content">Content</div>
<div class="footer">Footer</div>
<footer name="bottom">Footer #2</footer>
```

#### Text:

> All characters following a tag are treated as text

```
h1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```
```html
<h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
```

> Tags followed by a dot (.) will make all following indented text into a text string.

```
#content.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi consequat odio nec magna fermentum, sit amet placerat nisl fringilla.
```
```html
<div id="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi consequat odio nec magna fermentum, sit amet placerat nisl fringilla.</div>
```

#### Doctype:

> Render a doctype

```
! 5
```
```html
<!DOCTYPE html>
```

#### Include:

> Include sneak templates.

```
- Posts:
  = "post.sneak"
```
```html
{block:Posts}
  <!-- parsed contents of post.sneak -->
{/block:Posts}
```

#### Locals:

> Sneak also accepts locals.  Syntactically, they are variables with an exclamation mark appended to the end.

```
h1 #{foo!}
h2- bar!
```
```html
<!-- assuming foo is "bar" and bar is "foo" -->
<h1>bar</h1>
<h2>foo</h2>
```
### Usage

#### CLI

```
$ npm install sneak -g
$ sneak --help
```

#### API
```javascript
var sneak = require('sneak');

// render
sneak.render('h1 Title\n  p Content', options);

// renderFile
sneak.renderFile('index.sneak', options);

// compile
sneak.compile('h1 Title\n  p= foo!', options);

// compileFile
sneak.compileFile('index.sneak', options);
```
###### Options:
- **basepath** *(string)* a path to search for files included relatively.
- **encoding** *(string)* the encoding format to read and write files in.

> for `render` and `renderFile` the options object is also used to pass locals.

## License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](CONTRIBUTING.md)
