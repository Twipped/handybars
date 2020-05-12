
import { arrayify, truthy } from '../utils';

/**
 * Tests if any of the values in the provided array or object are truthy.
 * May be used inline or as a conditional block.
 *
 * @category collections,logic,default
 * @signature {{any input}}
 * @param  {array<mixed>|object<mixed>} input Array containing any truthy
 * values, or an object with any property that is truthy
 * @return {boolean}
 *
 * @signature {{#any input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/any}}
 * @example
 * {{#any flags}}Sore or all flags are true.{{else}}None of the flags are true.{{/any}}
 *
 * @signature {{any arg1 [... argN]}}
 * @param {mixed} [argN] Some value to be checked for truthiness
 * @return {boolean} Returns the first truthy value, or an empty string.
 *
 * @signature {{#any arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
 * @describe Truthy block will evaluate if any of the values are truthy.
 * @param {mixed} [argN] Some value to be checked for truthiness
 */
export default function any (...args) {
	const { fn, inverse } = args.pop();

	if (!args.length) {
		throw new Error('Helper "any" needs 1 parameter');
	}

	let input;
	if (args.length > 1) {
		input = args;
	} else {
		input = arrayify(args[0]);
	}

	let result = false;
	for (const value of input) {
		if (truthy(value)) {
			result = value;
			break;
		}
	}

	if (!fn) return result || '';

	return result ? fn(result) : inverse && inverse();
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{any a }}',
			input: { a: [ 0 ] },
			output: '',
		},
		{
			template: '{{any a }}',
			input: { a: [ 0, 0 ] },
			output: '',
		},
		{
			template: '{{any a }}',
			input: { a: [ 0, 1 ] },
			output: '1',
		},
		{
			template: '{{any a }}',
			input: { a: [ 1, 2 ] },
			output: '1',
		},
		{
			template: '{{any a }}',
			input: { a: {} },
			output: '',
		},
		{
			template: '{{any a }}',
			input: { a: { a: true } },
			output: 'true',
		},
		{
			template: '{{any a}}',
			input: { a: [ 0, [] ] },
			output: '',
		},
		{
			template: '{{any a}}',
			input: { a: [ 0, [ -0 ] ] },
			output: '0',
		},
		{
			template: '{{any a}}',
			input: { a: [ 0, [ 'a' ] ] },
			output: 'a',
		},
		{
			template: '{{any a}}',
			input: { a: [ 0, [ 1 ] ] },
			output: '1',
		},
		{
			template: '{{any a}}',
			input: { a: [ [], [] ] },
			output: '',
		},

		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: [ 0 ] },
			output: 'no',
		},
		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: [ 0, 0 ] },
			output: 'no',
		},
		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: [ 0, 1 ] },
			output: 'yes',
		},
		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: [ 1, 2 ] },
			output: 'yes',
		},
		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: {} },
			output: 'no',
		},
		{
			template: '{{#any a }}yes{{else}}no{{/any}}',
			input: { a: { a: true } },
			output: 'yes',
		},

		{
			template: '{{any a b c}}',
			input: { a: 1, b: 2, c: 0 },
			output: '1',
		},
		{
			template: '{{any a b c}}',
			input: { a: 0, b: 1, c: 2 },
			output: '1',
		},
		{
			template: '{{any a b}}',
			input: { a: '0', b: '1' },
			output: '0',
		},
		{
			template: '{{any a}}',
			input: { a: 1, b: 2, c: 0 },
			output: '1',
		},
		{
			template: '{{any c}}',
			input: { a: 1, b: 2, c: 0 },
			output: '',
		},
		{
			template: '{{any a b c}}',
			input: { a: [], b: [ 1 ], c: 2 },
			output: '1',
		},
		{
			template: '{{any "<div>"}}',
			output: '&lt;div&gt;',
		},
		{
			template: '{{{any "<div>"}}}',
			output: '<div>',
		},
		{
			template: '{{#any a b c}}content{{/any}}',
			input: { a: 1, b: 2, c: 0 },
			output: 'content',
		},
		{
			template: '{{#any a b}}content{{/any}}',
			input: { a: 0, b: 0 },
			output: '' },
		{
			template: '{{#any a b}}content{{else}}other content{{/any}}',
			input: { a: 0, b: '' },
			output: 'other content',
		},
		{
			template: '{{#any a}}content{{/any}}',
			input: { a: 1, b: 2 },
			output: 'content',
		},
	);
}
