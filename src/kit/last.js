
import { contextIterate, sizeOf, slice } from '../utils';

/**
 * Returns the last N items in the passed array.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections,strings
 * @signature {{last input[ count]}}
 * @param  {Array|Object|String}  input Collection or String
 * @param  {Number} [count] Number of items to exclude
 * @return {Array} Array excluding the number of items specified
 *
 * @signature {{#last input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/last}}
 * @example
 * // items = ['a','b','c','d','e','f']
 * {{#last items, 2}}<span>{{this}}</span>{{/last}}
 * // Result: <span>a</span><span>b</span>
 */
export default function last (...args) {
	const { fn, inverse, env, hash } = args.pop();
	if (!args.length) {
		throw new Error('Handlebars Helper "first" needs at least one parameter');
	}

	let [ input, count ] = args;
	count = count || 1;

	const result = slice(input, -count);
	const c = sizeOf(result);
	if (!c) return inverse ? inverse() : input;
	if (!fn) return result;

	return contextIterate(result, env, fn, hash);

}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{last a }}',
			input: { a: [ 1, 2, 3 ] },
			output: '3',
		},
		{
			template: '{{last a 2}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2,1',
		},
		{
			template: '{{#last a 2}}|{{this}}|{{else}}no{{/last}}',
			input: { a: [ 3, 2, 1 ] },
			output: '|2||1|',
		},
		{
			template: '{{#last a 2}}|{{this}}|{{else}}no{{/last}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
