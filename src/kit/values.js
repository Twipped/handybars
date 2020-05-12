
import { values as valuesUtil, sizeOf, contextIterate } from '../utils';

/**
 * Returns the values of an array or object.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections
 * @signature {{values input}}
 * @param  {array<mixed>|object} input
 * @return {array<mixed>}
 *
 * @signature {{#values}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/values}}
 */
export default function values (...args) {
	const { fn, inverse, env, hash } = args.pop();
	const [ input ] = args;

	const results = valuesUtil(input);
	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{values a}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: 'a,b,c',
		},
		{
			template: '{{values a}}',
			input: { a: { a: 1, b: 2, c: 3 } },
			output: '1,2,3',
		},
		{
			template: '{{values a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#values a}}<{{this}}>{{else}}no{{/values}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '<a><b><c>',
		},
		{
			template: '{{#values a}}<{{this}}>{{else}}no{{/values}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
