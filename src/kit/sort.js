
import { sizeOf, sort as sortUtil, contextIterate } from '../utils';

/**
 * Sorts the provided array.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections
 * @signature {{sort input[ keyBy]}}
 * @param  {array<mixed>} input
 * @param  {string} [keyBy] If the input is a collection of objects, pass this argument to indicate what key should be compared.
 * @return {array}
 *
 * @signature {{#sort input[ key]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/sort}}
 */
export default function sort (...args) {
	const { fn, inverse, env, hash } = args.pop();

	if (!args.length) {
		throw new Error('Handlebars Helper "sort" needs at least 1 parameter');
	}

	const [ input, keyBy ] = args;

	const results = sortUtil(input, keyBy);
	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{sort a }}',
			input: { a: [ 1, 2, 3 ] },
			output: '1,2,3',
		},
		{
			template: '{{sort a}}',
			input: { a: [ 3, 2, 1 ] },
			output: '1,2,3',
		},
		{
			template: '{{sort a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#sort a "a"}}|{{#each this}}{{@key}}:{{this}},{{/each}}|{{else}}no{{/sort}}',
			input: { a: [ { a: 4 }, { a: 3 }, { b: 1 } ] },
			output: '|a:3,||a:4,||b:1,|',
		},
		{
			template: '{{#sort a}}|{{this}}|{{else}}no{{/sort}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
