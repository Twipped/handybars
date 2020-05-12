
import { keys as keysUtil, sizeOf, contextIterate } from '../utils';

/**
 * Returns the indexes of an array or the keys of an object.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections
 * @signature {{keys input}}
 * @param  {array<mixed>|object} input
 * @return {array<integer|string>}
 *
 * @signature {{#keys}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/keys}}
 */
export default function keys (...args) {

	const { fn, inverse, env, hash } = args.pop();
	const [ input ] = args;

	const results = keysUtil(input);
	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{keys a}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '0,1,2',
		},
		{
			template: '{{keys a}}',
			input: { a: { a: 1, b: 2, c: 3 } },
			output: 'a,b,c',
		},
		{
			template: '{{keys a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#keys a}}<{{this}}>{{else}}no{{/keys}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '<0><1><2>',
		},
		{
			template: '{{#keys a}}<{{this}}>{{else}}no{{/keys}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
