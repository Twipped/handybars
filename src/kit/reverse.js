
import { isString, isObject, isArray, isNumber, toPairs, fromPairs, safe } from '../utils';

/**
 * Reverses the order of a string or array, negates an integer, or returns an object with the keys in reverse order
 * @category collections,strings,math
 * @name reverse
 *
 * @signature (reverse input)
 * @param  {Array<mixed>|string|integer} input
 * @return {Array<mixed>|string|integer}
 */
export default function reverse (...args) {
	const { fn } = args.pop();
	const input = fn ? safe.down(fn(this)) : args[0];

	if (isString(input)) {
		return input.split('').reverse().join('');
	} else if (isNumber(input)) {
		return 0 - input;
	} else if (isArray(input)) {
		return [ ...input ].reverse();
	} else if (isObject(input)) {
		return fromPairs(toPairs(input).reverse());
	}
	throw new Error('Handlebars Helper "reverse" cannot operate upon ' + (typeof input) + 's.');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{reverse a}}',
			input: { a: 'abcdef' },
			output: 'fedcba',
		},
		{
			template: '{{#reverse}}abcdef{{/reverse}}',
			input: { a: 'abcdef' },
			output: 'fedcba',
		},
		{
			template: '{{reverse a}}',
			input: { a: 1 },
			output: '-1',
		},
		{
			template: '{{reverse a}}',
			input: { a: [ 'ab', 'cd', 'ef' ] },
			output: 'ef,cd,ab',
		},
	);
}
