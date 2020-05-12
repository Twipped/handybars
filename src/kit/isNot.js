

/**
 * Tests that the first argument does not match any of the other arguments with strict equality.
 * @category logic,default
 *
 * @signature {{isNot value test1 ... testN}}
 * @param  {mixed} value Value to check against
 * @param  {mixed} ...test Values to test
 * @return {mixed} Matched value
 *
 * @signature {{#isNot value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isNot}}
 */

export default function isNot (...args) {
	if (args.length < 3) {
		throw new Error('Helper "isNot" needs a minimum of 2 arguments');
	}

	const { fn, inverse } = args.pop();
	const value = args.shift();

	var result = args.indexOf(value) === -1;

	if (!fn) return result || '';

	return result ? fn() : inverse && inverse();
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{isNot a b}}',
			input: { a: 1, b: 2 },
			output: 'true',
		},
		{
			template: '{{isNot a b}}',
			input: { a: 2, b: 1 },
			output: 'true',
		},
		{
			template: '{{isNot a b}}',
			input: { a: 2, b: 2 },
			output: '',
		},
		{
			template: '{{isNot a b}}',
			input: { a: '2', b: 2 },
			output: 'true',
		},
		{
			template: '{{#isNot a b}}yes{{else}}no{{/isNot}}',
			input: { a: 1, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#isNot a b}}yes{{else}}no{{/isNot}}',
			input: { a: 2, b: 1 },
			output: 'yes',
		},
		{
			template: '{{#isNot a b}}yes{{else}}no{{/isNot}}',
			input: { a: 2, b: 2 },
			output: 'no',
		},
		{
			template: '{{#isNot a b}}yes{{else}}no{{/isNot}}',
			input: { a: 2, b: '2' },
			output: 'yes',
		},
		{
			template: '{{#isNot 2 2 "2" 1}}yes{{else}}no{{/isNot}}',
			input: {},
			output: 'no',
		},
		{
			template: '{{#isNot 2 "1" "2"}}yes{{else}}no{{/isNot}}',
			input: {},
			output: 'yes',
		},
	);
}
