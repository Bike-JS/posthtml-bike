const TAGS = [
  'a','abbr','address','area','article','aside','audio','b','base','bdi','bdo','blockquote',
  'body','br','button','canvas','caption','cite','code','col','colgroup','datalist','dd','del','details','dfn',
  'dialog','div','dl','dt','em','embed','fieldset','figcaption','figure','footer','form',
  'h1','h2','h3','h4','h5','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','keygen',
  'label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav','noscript','object',
  'ol','optgroup','option','output','p','param','pre','progress','q','rp','rt','ruby','s','samp',
  'script','section','select','small','source','span','strong','style','sub','summary','sup',
  'table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','u','ul','var','video','wbr'
];

export const AUTO_TAGS = {
  header: 'header',
  main: 'article',
  footer: 'footer',
  title: 'h2',
  list: 'ul',
  'list-item': 'li',
  link: 'a'
};

export const AUTO_CLASSES = {
  li: ({ component }) => (`${component.elem}-item`),
  a: ({ component }) => {
    if (component.parent.tag === 'ul') {
      return `${component.parent.component.elem}-link`;
    }

    return 'link'
  }
};

const DEFAULT_OPTIONS = {
  tag: 'component',
  replaceComponentTag: 'section',
  replaceElemTag: 'div',
  skipTags: ['b', 'strong', 'i', 'span', 'div', 'section'],
  autoTags: AUTO_TAGS,
  autoClasses: AUTO_CLASSES,
};

const selector = (block, elem, modName, modVal) => (
  `${block}${elem ? `__${elem}` : ''}${modName ? (modVal ? `_${modName}_${modVal}` : `_${modName}`) : ''}`
);

const classWithMods = (block, elem, mods, className = `${block}__${elem}`) => (
  [className, ...mods.map(([name, value]) => selector(block, elem, name, value))].join(' ')
);

export default (options = DEFAULT_OPTIONS) => {
  options = Object.assign({ }, DEFAULT_OPTIONS, options);

  return (tree) => {
    const process = (node, parent) => {
      if (node.tag === undefined || options.skipTags.includes(node.tag)) {
        return node;
      }

      node = { attrs: {}, ...node };

      const mods = Object.entries(node.attrs).filter(([name]) => (
        name.startsWith('mod-')
      )).map(([name, value]) => {
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
          elemName = options.autoClasses[node.tag](parent, options) || node.tag
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

    return tree;
  }
}