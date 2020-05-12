
import { filter as filterUtil, sizeOf, contextIterate } from '../utils';

/**
 * Filters a passed array, depending on the arguments provided.
 * May be used inline or as an iterator. Else condition evaluates if result is empty.
 *
 * @category collections
 * @signature {{filter input}} or {{#filter input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
 * @describe Filter all falsy items (`0`, `''`, `false`, `null`, `undefined`, etc).
 * @param {array<mixed>} input
 * @return {array}
 * @example
 * // items = [0, 1, null, 'test']
 * {{#filter items}}<p>{{this}}</p>{{/filter}}
 * // Result: <p>1</p><p>test</p>
 *
 * @signature {{filter input predicate}} or {{#filter input predicate}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
 * @describe Filter all items matching the passed predicate. Else condition evaluates if result is empty.
 * This format matches the predicate rules of the lodash filter function.
 * @param {array<mixed>} input
 * @param {mixed} value Value to filter.
 * @return {array}
 * @example
 * // items = [0, 1, 2]
 * {{#filter items 1}}<p>{{this}}</p>{{/filter}}
 * // Result: <p>0</p><p>2</p>
 *
 * @signature {{filter input key value}} or {{#filter input key value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
 * @describe Performs a pluck operation, filtering all objects from the array where the provided property name does not match the provided value. (`O[n][property] != value`)
 * @param {array<mixed>} input
 * @param {string} key Object property name to check against the value
 * @param {mixed} value Value to filter.
 * @return {array}
 * @example
 * // original = [{a:1}, {b:2}, {a:1,b:2}, {}]
 * {{#filter original "a" 1}}|{{#each this}}<span>{{@key}}:{{this}}</span>{{/each}}|{{else}}no{{/filter}}
 * // Result: '|<span>a:1</span>||<span>a:1</span><span>b:2</span>|'
 *
 */
export default function filter (...args) {

	const { env, fn, inverse, hash } = args.pop();
	if (!args.length) throw new Error('Helper "filter" needs at least one parameter');

	const input = args.shift();
	let results;

	if (!args.length) results = filterUtil(input);
	else if (args.length === 1) results = filterUtil(input, args[0]);
	else results = filterUtil(input, args);

	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{filter original }}',
			input: { original: [ 0, 1, 2, undefined, 3, null, 4 ] },
			output: '1,2,3,4',
		},
		{
			template: '{{filter original 2 }}',
			input: { original: [ 0, 1, 2, undefined, 3, null, 4 ] },
			output: '2',
		},
		{
			template: '{{#filter original "a" 1}}|{{#each this}}{{@key}}:{{this}},{{/each}}|{{else}}no{{/filter}}',
			input: { original: [ { a: 1 }, { b: 2 }, { a: 1, b: 2 }, {} ] },
			output: '|a:1,||a:1,b:2,|',
		},
		{
			template: '{{#filter original "b"}}|{{#each this}}{{@key}}:{{this}},{{/each}}|{{else}}no{{/filter}}',
			input: { original: [ { a: 1 }, { b: 2 }, { a: 1, b: 2 }, {} ] },
			output: '|b:2,||a:1,b:2,|',
		},
		{
			template: '{{#filter original}}|{{#each this}}{{@index}}:{{this}},{{/each}}|{{else}}no{{/filter}}',
			input: { original: [ 0, 0, 0 ] },
			output: 'no',
		},
		{
			template: '{{#filter original "a" 2}}|{{this}}|{{else}}no{{/filter}}',
			input: { original: [ { a: 1 }, { b: 1 } ] },
			output: 'no',
		},
	);
}
