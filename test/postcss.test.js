import postCssBike from 'postcss-bike';

import { testOutput } from './helpers';

test('Component styles should be replaced to empty', () => testOutput(
  `<style type="text/postcss">
    @component app {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
  
      @elem header {
        flex: 0 0 40px;
      }
    }
  </style>
  <component name="app" mod-theme="dark"></component>`,
  `<style type="text/css">
.app {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}
.app__header {
  flex: 0 0 40px;
}
  </style>
  <section class="app app_theme_dark"></section>`,
  {
    postcss: {
      match: 'text/postcss',
      plugins: [ postCssBike() ]
    },
  }
));