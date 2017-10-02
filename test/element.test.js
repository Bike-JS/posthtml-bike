import { testOutput } from './helpers';
import { AUTO_CLASSES, AUTO_TAGS } from '../lib';

test('Elements should be replaced to HTML tags with BEM classes', () => testOutput(
  `<component name="test">
    <header></header>
    <main></main>
    <footer></footer>
  </component>`,
  `<section class="test">
    <header class="test__header"></header>
    <article class="test__main"></article>
    <footer class="test__footer"></footer>
  </section>`
));

test('Element should be replaced to HTML tag with mods classes', () => testOutput(
  `<component name="test">
    <test-elem mod-test="yes" mod-ready></test-elem>
  </component>`,
  `<section class="test">
    <div class="test__test-elem test__test-elem_test_yes test__test-elem_ready"></div>
  </section>`
));

test('Element should be replaced to custom HTML tag with BEM classes', () => testOutput(
  `<component name="test">
    <title tag="h1"></title>
  </component>`,
  `<section class="test">
    <h1 class="test__title"></h1>
  </section>`
));

test('Element should be replaced to custom HTML tag from config', () => testOutput(
  `<component name="test">
    <test-elem></test-elem>
  </component>`,
  `<section class="test">
    <p class="test__test-elem"></p>
  </section>`,
  { replaceElemTag: 'p' }
));

test('List element should be replaced to custom HTML tags with BEM classes', () => testOutput(
  `<component name="test">
    <list>
      <li>
        <a href="#">Link 1</a>
      </li>
      <li>Item 2</li>
      <li>Item 3</li>
    </list>
  </component>`,
  `<section class="test">
    <ul class="test__list">
      <li class="test__list-item">
        <a href="#" class="test__list-link">Link 1</a>
      </li>
      <li class="test__list-item">Item 2</li>
      <li class="test__list-item">Item 3</li>
    </ul>
  </section>`
));

test('Custom tags for elements from config', () => testOutput(
  `<component name="test">
    <test-elem></test-elem>
  </component>`,
  `<section class="test">
    <p class="test__test-elem"></p>
  </section>`,
  {
    autoTags: {
      ...AUTO_TAGS,
      'test-elem': 'p'
    }
  }
));

test('Custom classes for elements from config', () => testOutput(
  `<component name="test">
    <test-elem></test-elem>
  </component>`,
  `<section class="test">
    <div class="test__replaced-class"></div>
  </section>`,
  {
    autoClasses: {
      ...AUTO_CLASSES,
      'test-elem': () => (`replaced-class`),
    }
  }
));

test('Skip replace element config', () => testOutput(
  `<component name="test">
    <span></span>
  </component>`,
  `<section class="test">
    <span></span>
  </section>`,
  { skipTags: ['span'] }
));