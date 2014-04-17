sneak
=============

> sneak is in pre-alpha.  like, fresh-out-conception.  

A template engine heavily insipired by [jade](http://www.github.com/visionmedia/jade) written with Tumblr in mind.

### Installation
`npm install sneak -g`

### Why should you care?
To quote [@jenius](https://github.com/carrot/carrot-the-company/blob/master/ideas/tumblr-parser.md):

> Tumblr development at the moment is severely painful - you have to write the code without the tumblr tags, then paste it into tumblr to test. Their online text editor is slower, more awkward, and doesn't have the version control and text editing shortcuts we know, love, and rely on.

My answer is **sneak**, a template engine that looks familiar to jade users but has been sanded down and re-tooled for Tumblr theme development.

### Syntax
```
! 5
html
  head
    title
      - PageTitle:
        #{Title}
  body
    - Posts:
      h1 #{Title}
```
becomes:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>{block:PageTitle}{Title}{/block:PageTitle}</title>
  </head>
  <body>
    {block:Posts}
      <h1>{Title}</h1>
    {/block:Posts}
  </body>
</html>
```

### Usage
`sneak render tumblr.sneak`
