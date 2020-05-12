

/**
 * Tests if the first argument is greater than the second argument.
 * May be used inline or as a conditional block.
 * @category logic
 *
 * @signature {{gt value1 value2}}
 * @param  {string|integer} value1
 * @param  {string|integer} value2
 * @return {boolean}
 *
 * @signature {{#gt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gt}}
 */

export default function gt (a, b, { fn, inverse }) {
	if (arguments.length !== 3) {
		throw new Error('Helper "gt" needs 2 parameters');
	}

	if (!fn) return a > b || '';
	if (a > b) return fn();
	return inverse && inverse();
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{gt a b}}',
			input: { a: 1, b: 2 },
			output: '',
		},
		{
			template: '{{gt a b}}',
			input: { a: 2, b: 1 },
			output: 'true',
		},
		{
			template: '{{gt a b}}',
			input: { a: 2, b: 2 },
			output: '',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 1, b: 2 },
			output: 'no',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 2, b: 1 },
			output: 'yes',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 2, b: 2 },
			output: 'no',
		},
	);
}
