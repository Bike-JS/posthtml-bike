# Bike plugin

[![Build](https://travis-ci.org/Satanpit/posthtml-bike.svg?branch=master)](https://travis-ci.org/Satanpit/posthtml-bike)

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
}
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
