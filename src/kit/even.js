

/**
 * Tests if the passed argument is an even number
 * @category math
 *
 * @signature {{even value}}
 * @param  {number} value Value to test
 * @return {boolean}
 *
 * @signature {{#even value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/even}}
 * @describe Truthy block will evaluate with the result value as the current scope.
 */

export default function even (...args) {
	if (args.length < 2) {
		throw new Error('Helper "even" needs a minimum of 1 arguments');
	}

	const { fn, inverse } = args.pop();
	const value = args[0];

	const result = !(value % 2);
	if (!fn) return result || '';
	return result ? fn() : inverse && inverse();
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{even a}}',
			input: { a: 11 },
			output: '',
		},
		{
			template: '{{even a}}',
			input: { a: 22 },
			output: 'true',
		},
		{
			template: '{{#even a}}yes{{else}}no{{/even}}',
			input: { a: 1 },
			output: 'no',
		},
		{
			template: '{{#even a}}yes{{else}}no{{/even}}',
			input: { a: 0 },
			output: 'yes',
		},
	);
}
