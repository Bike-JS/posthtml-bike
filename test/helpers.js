import posthtml from 'posthtml';
import plugin from '../lib';

export const testOutput = (input, output, options) => {
  return posthtml().use(plugin(options)).process(input).then((result) => {
    return expect(output).toEqual(result.html);
  });
};