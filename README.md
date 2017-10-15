# Bike plugin
[![NPM](https://img.shields.io/npm/v/posthtml-bike.svg)](https://npmjs.com/package/posthtml-bike)
[![Build](https://travis-ci.org/Satanpit/posthtml-bike.svg)](https://travis-ci.org/Satanpit/posthtml-bike)

This plugin transform custom tags to BEM-like HTML

## Install
```
npm i -D posthtml-bike
```

## Usage

```javascript
const { readFileSync } = require('fs');
const posthtml = require('posthtml');
const bike = require('posthtml-bike');

const html = readFileSync('index.html');

posthtml([ bike() ]).process(html).then((result) => console.log(result.html));
```

## Example

### Default

```html
<component name="example">
    <header></header>
    <main></main>
    <footer></footer>
</component>
```

Transformed to:

```html
<section class="example">
    <header class="example__header"></header>
    <article class="example__main"></article>
    <footer class="example__footer"></footer>
</section>
```

### With mods

```html
<component name="example" mod-theme="dark" mod-active>
    <header></header>
    <main mod-hidden></main>
    <footer></footer>
</component>
```

Transformed to:

```html
<section class="example example_theme_dark example_active">
    <header class="example__header"></header>
    <article class="example__main example__main_hidden"></article>
    <footer class="example__footer"></footer>
</section>
```

### With tag attr

```html
<component name="button" tag="button">
    <main tag="span"></main>
</component>
```

Transformed to:

```html
<button class="button">
    <span class="button__main"></span>
</button>
```

## Options

```javascript
{
    /**
    * Component root tag name
    * @default
    */
    tag: 'component',
    
    /**
    * Default component root HTML tag
    * @default
    */
    replaceComponentTag: 'section',
    
    /**
    * Default element HTML tag
    * @default
    */
    replaceElemTag: 'div',
    
    /**
    * Skip HTML tags list
    * @default
    */
    skipTags: ['b', 'strong', 'i', 'span', 'div', 'section'],
    
    /**
    * These elements will be replaced to defined HTML tags
    * @default
    */
    autoTags: {
        header: 'header',
        main: 'article',
        footer: 'footer',
        title: 'h2',
        list: 'ul',
        'list-item': 'li',
        link: 'a'
    },
    
    /**
    * Config for generated custom element name by HTML tag
    * @default
    */
    autoClasses: {
      li: () => {}, // Generate element name for `li` tag
      a: () => {}, // Generate element name for `a` tag
    },
   
    /**
    * Config for process styles in component 
    * @default
    */
    postcss: false,
}
```

### Use with postcss-bike

Example for use with [postcss-bike](https://github.com/Bike-JS/postcss-bike)

```html
<style type="text/postcss">
    @component app {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
    
      @elem header {
        flex: 0 0 40px;
      }
    }
</style>
<component name="app" mod-theme="dark"></component>
```

Transformed to:

```html
<style type="text/css">
    .app {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
    }
    .app__header {
      flex: 0 0 40px;
    }
</style>
<section class="app app_theme_dark"></section>
```

#### Options

```javascript
{
  postcss: {
    match: 'text/postcss', // Match `style` tag by type
    plugins: [], // Postcss plugins
    process: (css, node) => { // Save processed css function
      node.attrs.type = 'text/css';
      node.content = ['\n', css];
      return node;
    }
  }
}
```

Example for save all components styles in one file:

```javascript
import { appendFileSync } from 'fs';
import gulp from 'gulp';
import gulpPosthtml from 'gulp-posthtml';
import gulpClean from 'gulp-clean';

import postCssBike from 'postcss-bike';

gulp.task('clean', () => (
  gulp.src('examples/dist/components.css').pipe(gulpClean())
));

gulp.task('html', ['clean'], () => {
  gulp.src('/components/*.html')
    .pipe(gulpPosthtml([
      bike({
        postcss: {
          match: 'text/postcss',
          plugins: [ postCssBike() ],
          appendTo: '/dist/components.css',
          process(css, node, options) {
            appendFileSync(options.postcss.appendTo, css);
            node.tag = false;
            node.content = [''];
            return node;
          }
        },
      }),
    ]))
    .pipe(gulp.dest('/dist'))
});
```

### Auto classes

Example config for `li` tag,
result class - `${componentName}__${parentElementName}-item`

```javascript
{
  li: ({ component }) => (`${component.elem}-item`)
}
```

```html
<component name="example">
    <list>
      <li>Item 1</li>
      <li>Item 2</li>
    </list>
</component>
```
Transformed to:
```html
<section class="example">
    <ul class="example__list">
      <li class="example__list-item">Item 1</li>
      <li class="example__list-item">Item 2</li>
    </ul>
</section>
```

Auto class function args:
* `parent` - Parent node object
    * `component` - `{ name, elem, parent }` Custom item with plugin info
* `options` - Plugin options

For example:

```javascript
import bike, { AUTO_TAGS, AUTO_CLASSES } from 'posthtml-bike';

const options = {
  autoTags: {
    ...AUTO_TAGS,
    'my-tag': 'p'
  },
  autoClasses: {
    ...AUTO_CLASSES,
    i: ({ component }) => (`${component.elem}-icon`)
  }
}
```
