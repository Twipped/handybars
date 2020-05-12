
import { slice, sizeOf, contextIterate } from '../utils';

/**
 * Returns all of the items in the collection after the specified index.
 * May be used inline or as an iterator.
 *
 * @category collections
 * @signature {{after items [count]}}
 * @param  {Array}  input Collection
 * @param  {Number} [count] Number of items to exclude
 * @return {Array} Array excluding the number of items specified
 *
 * @signature {{#after input [count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/after}}
 * @example
 * // items = ['a','b','c','d','e','f']
 * {{#after items 2}}<span>{{this}}</span>{{/after}}
 * // Result: <span>c</span><span>d</span><span>e</span><span>f</span>
 */
export default function after (...args) {
	if (args.length === 1) {
		throw new Error('Helper "after" needs at least one parameter');
	}

	const { fn, inverse, env, hash } = args.pop();
	const [ input, count ] = args;

	var results = slice(input, count);
	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{after a }}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '1,2,3,4,5',
		},
		{
			template: '{{after a 2}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '3,4,5',
		},
		{
			template: '{{after a 6}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '',
		},
		{
			template: '{{#after a }}|{{this}}|{{/after}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '|1||2||3||4||5|',
		},
		{
			template: '{{#after a 2}}|{{this}}|{{/after}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '|3||4||5|',
		},
		{
			template: '{{#after a 6}}|{{this}}|{{/after}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '',
		},
	);
}
