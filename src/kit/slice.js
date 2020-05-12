
import { isString, sizeOf, isMappable, slice as sliceUtil, contextIterate } from '../utils';

/**
 * Returns a slice of an array, object map, or string
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections,strings
 * @signature {{slice input start[ count]}}
 * @param  {string|Array|object|Map|Set} input
 * @param  {integer} start  Index to slice from
 * @param  {integer} [end]  Index to slice to (stopping before)
 * @return {mixed}
 *
 * @signature {{#slice input start[ end]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/slice}}
 * @param  {string|Array|object|Map|Set} input
 * @param  {integer} start  Index to slice from
 * @param  {integer} [end]  Index to slice to (stopping before)
 * @return {string}
 */
export default function slice (...args) {
	const { fn, inverse, env, hash } = args.pop();
	const [ input, start, end ] = args;

	if (args.length < 2) {
		throw new Error('Helper "slice" needs at least 2 parameters');
	}

	if (!isString(input) && !isMappable(input)) {
		throw new Error('Helper "slice" did not receive a string or collection.');
	}

	const results = sliceUtil(input, start, end);
	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{slice a 1}}',
			input: { a: 'Praesent' },
			output: 'raesent',
		},
		{
			template: '{{slice a 1 3}}',
			input: { a: 'Praesent' },
			output: 'ra',
		},
		{
			template: '{{slice a 1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2,1',
		},
		{
			template: '{{slice a 1 2}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2',
		},
		{
			template: '{{slice a 0 1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '3',
		},
		{
			template: '{{slice a -1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '1',
		},
		{
			template: '{{#slice a 1}}|{{this}}|{{else}}no{{/slice}}',
			input: { a: [ 3, 2, 1 ] },
			output: '|2||1|',
		},
		{
			template: '{{#slice a 1}}|{{this}}|{{else}}no{{/slice}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
