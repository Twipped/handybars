
import { sizeOf, slice, contextIterate } from '../utils';

/**
 * Returns the first N items in the passed array.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections,strings
 * @signature {{first input[ count]}}
 * @param  {Array|Object|String}  input Collection or String
 * @param  {Number} [count] Number of items to exclude
 * @return {Array} Array excluding the number of items specified
 *
 * @signature {{#first input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/first}}
 * @param {Array|Object|String} [varname] [description]
 * @example
 * // items = ['a','b','c','d','e','f']
 * {{#first items, 2}}<span>{{this}}</span>{{/first}}
 * // Result: <span>a</span><span>b</span>
 */
export default function first (...args) {
	const { fn, inverse, env, hash } = args.pop();
	if (!args.length) {
		throw new Error('Helper "first" needs at least one parameter');
	}

	let [ input, count ] = args;
	count = count || 1;

	const result = slice(input, 0, count);
	const c = sizeOf(result);
	if (!c) return inverse ? inverse() : input;
	if (!fn) return result;

	return contextIterate(result, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{first a }}',
			input: { a: [ 3, 2, 1 ] },
			output: '3',
		},
		{
			template: '{{first a 2}}',
			input: { a: [ 3, 2, 1 ] },
			output: '3,2',
		},
		{
			template: '{{#first a 2}}|{{@key}},{{@index}},{{this}}|{{else}}no{{/first}}',
			input: { a: [ 3, 2, 1 ] },
			output: '|0,0,3||1,1,2|',
		},
		{
			template: '{{#first a 2}}|{{this}}|{{else}}no{{/first}}',
			input: { a: [] },
			output: 'no',
		},
		{
			template: '{{#first a 2}}|{{@key}},{{@index}},{{this}}|{{else}}no{{/first}}',
			input: { a: { a: 3, b: 2, c: 1 } },
			output: '|a,0,3||b,1,2|',
		},
	);
}
