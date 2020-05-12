

/**
 * Tests if the first argument matches any of the other arguments with loose equality.
 * @category logic
 *
 * @signature {{isLike value test1 ... testN}}
 * @param  {mixed} value Value to check against
 * @param  {mixed} ...test Values to test
 * @return {mixed} Matched value
 *
 * @signature {{#isLike value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isLike}}
 * @describe Truthy block will evaluate with the result value as the current scope.
 */

export default function isLike (...args) {
	if (args.length < 3) {
		throw new Error('Helper "isLike" needs a minimum of 2 arguments');
	}

	const { fn, inverse } = args.pop();
	const value = args.shift();

	var result = false;
	var i = args.length;
	while (i-- && !result) {
		result = result || (value == args[i]); // eslint-disable-line eqeqeq
	}

	if (!fn) return result || '';

	return result ? fn() : inverse && inverse();
}

/***/

export function test (t) {
	t.multi(
		{
			template: '{{isLike a b}}',
			input: { a: 1, b: 2 },
			output: '',
		},
		{
			template: '{{isLike a b}}',
			input: { a: 2, b: 1 },
			output: '',
		},
		{
			template: '{{isLike a b}}',
			input: { a: 2, b: 2 },
			output: 'true',
		},
		{
			template: '{{isLike a b}}',
			input: { a: '2', b: 2 },
			output: 'true',
		},
		{
			template: '{{isLike a b}}',
			input: { a: '2', b: '1' },
			output: '',
		},
		{
			template: '{{#isLike a b}}yes{{else}}no{{/isLike}}',
			input: { a: 1, b: 2 },
			output: 'no',
		},
		{
			template: '{{#isLike a b}}yes{{else}}no{{/isLike}}',
			input: { a: 2, b: 1 },
			output: 'no',
		},
		{
			template: '{{#isLike a b}}yes{{else}}no{{/isLike}}',
			input: { a: 2, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#isLike a b}}yes{{else}}no{{/isLike}}',
			input: { a: 2, b: '2' },
			output: 'yes',
		},
		{
			template: '{{#isLike a b}}yes{{else}}no{{/isLike}}',
			input: { a: '2', b: '1' },
			output: 'no',
		},
		{
			template: '{{#isLike 2 2 "2" 1}}yes{{else}}no{{/isLike}}',
			input: {},
			output: 'yes',
		},
	);
}
