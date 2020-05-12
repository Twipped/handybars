
import { sizeOf, contextIterate } from '../utils';

/**
 * Evaluates the block contents for each item in a collection.
 * May be used inline or as an iterator.
 *
 * @category collections,logic,default
 *
 * @signature {{#each input [count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/each}}
 * @example
 * // items = ['a','b','c','d','e','f']
 * {{#each items 2}}<span>{{this}}</span>{{/each}}
 * // Result: <span>c</span><span>d</span><span>e</span><span>f</span>
 */
export default function each (collection, ...args) {
	const { env, fn, inverse, hash } = args.pop();

	const c = sizeOf(collection);
	if (!c) return inverse ? inverse() : collection;
	if (!fn) return collection;

	return contextIterate(collection, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{each a }}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '1,2,3,4,5',
		},
		{
			template: '{{each a 2}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '1,2,3,4,5',
		},
		{
			template: '{{#each a }}|{{this}}|{{/each}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '|1||2||3||4||5|',
		},
		{
			template: '{{#each a 2}}|{{this}}|{{/each}}',
			input: { a: [ 1, 2, 3, 4, 5 ] },
			output: '|1||2||3||4||5|',
		},
		{
			template: '{{#each a}}|{{this}}|{{else}}success{{/each}}',
			input: { a: false },
			output: 'success',
		},
		{
			template: '{{#each a}}|{{this}}|{{else}}success{{/each}}',
			input: { a: [] },
			output: 'success',
		},
		{
			template: '{{#each a}}|{{this}}|{{else}}success{{/each}}',
			input: { a: new Map() },
			output: 'success',
		},
	);
}
