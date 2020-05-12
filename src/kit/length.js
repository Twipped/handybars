
import { sizeOf } from '../utils';

/**
 * Returns the number of keys on an object, or the length of an array or string.
 * May be used inline or as an iterator. Else condition evaluates if result is 0.
 *
 * @category collections
 *
 * @signature {{length input}}
 * @describe Returns the length of the input
 * @param {array|object|string} input
 * @return {integer}
 *
 * @signature {{length input target}}
 * @descibe Returns a boolean if the length matches the passed target.
 * @param {array|object|string} input
 * @param {integer} target The target length to check against
 * @return {boolean}
 *
 * @signature {{#length input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/length}}
 * @describe Evaluates block content if the length is greater than 0, else if it is not.
 * @param {array|object|string} input
 *
 * @signature {{#length input target}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/length}}
 * @describe Evaluates block content if the length matches the target, else block if it does not
 * @param {array|object|string} input
 * @param {interger} target The target length it should match in order to evaluate.
 */
export default function length (...args) {
	if (args.length === 1) {
		throw new Error('Handlebars Helper "length" needs 1 parameter');
	}

	const options = args.pop();
	const input = args[0];
	const target = args.length > 1 ? args[1] : false;

	var results = sizeOf(input);

	if (!options.fn) return target === false ? results : results === target && target || 0;

	if (target === false ? results : results === target) {
		return options.fn(this);
	}
	return options.inverse(this);

}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{length a }}',
			input: { a: [ 1, 2, 3 ] },
			output: '3',
		},
		{
			template: '{{length a }}',
			input: { a: [] },
			output: '0',
		},
		{
			template: '{{#length a}}yes{{else}}no{{/length}}',
			input: { a: [ 3, 2, 1 ] },
			output: 'yes',
		},
		{
			template: '{{#length a}}yes{{else}}no{{/length}}',
			input: { a: [] },
			output: 'no',
		},

		{
			template: '{{length a 3}}',
			input: { a: [ 1, 2, 3 ] },
			output: '3',
		},
		{
			template: '{{length a 3}}',
			input: { a: [] },
			output: '0',
		},
		{
			template: '{{#length a 3}}yes{{else}}no{{/length}}',
			input: { a: [ 3, 2, 1 ] },
			output: 'yes',
		},
		{
			template: '{{#length a 3}}yes{{else}}no{{/length}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
