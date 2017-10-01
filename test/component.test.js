import { testOutput } from './helpers';

test('Component should be replaced to `section` tag', () => testOutput(
  `<component name="test"></component>`,
  `<section class="test"></section>`
));

test('Component should be replaced to custom tag', () => testOutput(
  `<component name="test" tag="article"></component>`,
  `<article class="test"></article>`
));

test('Component should be replaced to `section` tag with mods', () => testOutput(
  `<component name="test" mod-theme="dark" mod-ready></component>`,
  `<section class="test test_theme_dark test_ready"></section>`
));

test('Nested components should be replaced to `section` tags', () => testOutput(
  `<component name="test">
    <component name="sub-test"></component>
  </component>`,
  `<section class="test">
    <section class="sub-test"></section>
  </section>`,
));

test('Component should be replaced to tag from config', () => testOutput(
  `<component name="test"></component>`,
  `<div class="test"></div>`,
  { replaceComponentTag: 'div' }
));