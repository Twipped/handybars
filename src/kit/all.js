
import { all as allUtil } from '../utils';


/**
 * Tests if all of the values in the provided array or object are truthy.
 * May be used inline or as a conditional block.
 *
 * @category collections,logic,default
 * @signature {{all input}}
 * @param  {array<mixed>|object<mixed>} input Array whose values must all be truthy,
 * or an object whose properties must all be truthy
 * @return {boolean}
 *
 * @signature {{#all input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
 * @example
 * {{#all flags}}All flags are true.{{else}}Some or none of the flags are true.{{/all}}
 *
 * @signature {{all arg1 [... argN]}}
 * @param {mixed} [argN] Some value to be checked for truthiness
 * @return {mixed} Returns the first last argument if all are truthy, or else an empty string.
 *
 * @signature {{#all arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
 * @describe Truthy block will evaluate if all values are truthy. ({this}).
 * @param {mixed} [argN] Some value to be checked for truthiness
 */
export default function all (...args) {

	const { fn, inverse } = args.pop();

	if (!args.length) {
		throw new Error('Helper "all" needs 1 parameter');
	}

	const result = allUtil(...args);

	if (!fn) return result || '';

	return result ? fn(result) : inverse && inverse(this);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{all a }}',
			input: { a: [ 0 ] },
			output: '',
		},
		{
			template: '{{all a }}',
			input: { a: [ 0, 0 ] },
			output: '',
		},
		{
			template: '{{all a }}',
			input: { a: [ 0, 1 ] },
			output: '',
		},
		{
			template: '{{all a }}',
			input: { a: [ 1, 2 ] },
			output: '2',
		},
		{
			template: '{{all a }}',
			input: { a: {} },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: [], b: 1 },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: [ 1 ], b: 1 },
			output: '1',
		},
		{
			template: '{{all a b}}',
			input: { a: [], b: [ 1 ] },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: 0, b: [] },
			output: '',
		},
		{
			template: '{{all a }}',
			input: { a: { a: true } },
			output: 'true',
		},
		{
			template: '{{all a }}',
			input: { a: { a: true, b: false } },
			output: '',
		},

		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: [ 0 ] },
			output: 'no',
		},
		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: [ 0, 0 ] },
			output: 'no',
		},
		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: [ 0, 1 ] },
			output: 'no',
		},
		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: [ 1, 2 ] },
			output: 'yes',
		},
		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: {} },
			output: 'no',
		},
		{
			template: '{{#all a }}yes{{else}}no{{/all}}',
			input: { a: { a: true } },
			output: 'yes',
		},

		{
			template: '{{all a b c}}',
			input: { a: 1, b: 2, c: 0 },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: 0, b: 1 },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: '', b: '1' },
			output: '',
		},
		{
			template: '{{all a b}}',
			input: { a: '0', b: '1' },
			output: '1',
		},
		{
			template: '{{all a}}',
			input: { a: 1, b: 2, c: 0 },
			output: '1',
		},
		{
			template: '{{all c}}',
			input: { a: 1, b: 2, c: 0 },
			output: '',
		},
		{
			template: '{{all "<div>"}}',
			output: '&lt;div&gt;',
		},
		{
			template: '{{{all "<div>"}}}',
			output: '<div>',
		},
		{
			template: '{{#all a b c}}content{{/all}}',
			input: { a: 1, b: 2, c: 0 },
			output: '',
		},
		{
			template: '{{#all a b}}content{{/all}}',
			input: { a: 0, b: 0 },
			output: '' },
		{
			template: '{{#all a b}}content{{else}}other content{{/all}}',
			input: { a: 0, b: '' },
			output: 'other content',
		},
		{
			template: '{{#all a}}content{{/all}}',
			input: { a: 1, b: 2 },
			output: 'content',
		},
	);
}
