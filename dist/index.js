'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AUTO_CLASSES = exports.AUTO_TAGS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TAGS = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

const AUTO_TAGS = exports.AUTO_TAGS = {
  header: 'header',
  main: 'article',
  footer: 'footer',
  title: 'h2',
  list: 'ul',
  'list-item': 'li',
  link: 'a'
};

const AUTO_CLASSES = exports.AUTO_CLASSES = {
  li: ({ component }) => `${component.elem}-item`,
  a: ({ component }) => {
    if (component.parent.tag === 'ul') {
      return `${component.parent.component.elem}-link`;
    }

    return 'link';
  }
};

const DEFAULT_OPTIONS = {
  tag: 'component',
  replaceComponentTag: 'section',
  replaceElemTag: 'div',
  skipTags: ['b', 'strong', 'i', 'span', 'div', 'section'],
  autoTags: AUTO_TAGS,
  autoClasses: AUTO_CLASSES,
  postcss: false
};

const POSTCSS_DEFAULT_OPTIONS = {
  match: 'text/postcss',
  plugins: [],
  process: (css, node) => {
    node.attrs.type = 'text/css';
    node.content = ['\n', css];
    return node;
  }
};

const selector = (block, elem, modName, modVal) => `${block}${elem ? `__${elem}` : ''}${modName ? modVal ? `_${modName}_${modVal}` : `_${modName}` : ''}`;

const classWithMods = (block, elem, mods, className = `${block}__${elem}`) => [className, ...mods.map(([name, value]) => selector(block, elem, name, value))].join(' ');

exports.default = (options = DEFAULT_OPTIONS) => {
  options = _extends({}, DEFAULT_OPTIONS, options);

  return tree => {
    const process = (node, parent) => {
      if (node.tag === undefined || options.skipTags.includes(node.tag)) {
        return node;
      }

      node = _extends({ attrs: {} }, node);

      const mods = Object.entries(node.attrs).filter(([name]) => name.startsWith('mod-')).map(([name, value]) => {
        node.attrs[name] = undefined;
        return [name.replace(/^mod-/, ''), value];
      });

      if (node.attrs.name) {
        let componentName = node.attrs.name;

        node.tag = node.attrs.tag || options.replaceComponentTag;
        node.attrs.class = classWithMods(componentName, null, mods, node.attrs.name);

        node.attrs.name = undefined;
        node.attrs.tag = undefined;

        node.component = {
          name: componentName
        };
      } else {
        let elemName = node.tag;

        if (options.autoClasses[node.tag] !== undefined) {
          elemName = options.autoClasses[node.tag](parent, options) || node.tag;
        }

        node.attrs.class = classWithMods(parent.component.name, elemName, mods);
        node.component = {
          name: parent.component.name,
          elem: node.tag,
          parent
        };

        node.tag = node.attrs.tag || options.autoTags[node.tag] || TAGS[TAGS.indexOf(node.tag)] || options.replaceElemTag;
        node.attrs.tag = undefined;
      }

      if (node.content) {
        node.content = node.content.map(child => process(child, node));
      }

      return node;
    };

    tree.match({ tag: options.tag }, process);

    if (typeof options.postcss === 'object') {
      options.postcss = _extends({}, POSTCSS_DEFAULT_OPTIONS, options.postcss);

      tree.match({ tag: 'style', attrs: { type: options.postcss.match } }, node => {
        return options.postcss.process((0, _postcss2.default)([...options.postcss.plugins]).process(node.content).toString(), node, options);
      });

      return node;
    }

    return tree;
  };
};