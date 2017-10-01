'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TAGS = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

var AUTO_TAGS = exports.AUTO_TAGS = {
  header: 'header',
  main: 'article',
  footer: 'footer',
  title: 'h2',
  list: 'ul',
  'list-item': 'li',
  link: 'a'
};

var AUTO_CLASSES = exports.AUTO_CLASSES = {
  li: function li(_ref) {
    var component = _ref.component;

    return component.elem + '-item';
  },
  a: function a(_ref2) {
    var component = _ref2.component;

    if (component.parent.tag === 'ul') {
      return component.parent.component.elem + '-link';
    }

    return 'link';
  }
};

var DEFAULT_OPTIONS = {
  tag: 'component',
  replaceComponentTag: 'section',
  replaceElemTag: 'div',
  autoTags: AUTO_TAGS,
  autoClasses: AUTO_CLASSES
};

var selector = function selector(block, elem, modName, modVal) {
  return '' + block + (elem ? '__' + elem : '') + (modName ? modVal ? '_' + modName + '_' + modVal : '_' + modName : '');
};

var classWithMods = function classWithMods(block, elem, mods) {
  var className = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : block + '__' + elem;
  return [className].concat(_toConsumableArray(mods.map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        name = _ref4[0],
        value = _ref4[1];

    return selector(block, elem, name, value);
  }))).join(' ');
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_OPTIONS;

  options = Object.assign(DEFAULT_OPTIONS, options);

  return function (tree) {
    var process = function process(node, parent) {
      if (node.tag === undefined) {
        return node;
      }

      node = _extends({ attrs: {} }, node);

      var mods = Object.entries(node.attrs).filter(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            name = _ref6[0];

        return name.startsWith('mod-');
      }).map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            name = _ref8[0],
            value = _ref8[1];

        node.attrs[name] = undefined;
        return [name.replace(/^mod-/, ''), value];
      });

      if (node.attrs.name) {
        var componentName = node.attrs.name;

        node.tag = node.attrs.tag || options.replaceComponentTag;
        node.attrs.class = classWithMods(componentName, null, mods, node.attrs.name);

        node.attrs.name = undefined;
        node.attrs.tag = undefined;

        node.component = {
          name: componentName
        };
      } else {
        var elemName = node.tag;

        if (options.autoClasses[node.tag] !== undefined) {
          elemName = options.autoClasses[node.tag](parent) || node.tag;
        }

        node.attrs.class = classWithMods(parent.component.name, elemName, mods);
        node.component = {
          name: parent.component.name,
          elem: node.tag,
          parent: parent
        };

        node.tag = node.attrs.tag || options.autoTags[node.tag] || TAGS[TAGS.indexOf(node.tag)] || options.replaceElemTag;
        node.attrs.tag = undefined;
      }

      if (node.content) {
        node.content = node.content.map(function (child) {
          return process(child, node);
        });
      }

      return node;
    };

    tree.match({ tag: options.tag }, process);

    return tree;
  };
};