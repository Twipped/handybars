
/**
 * Rounds up the passed value
 * @category math
 * @name  ceil
 *
 * @signature {{ceil value}}
 * @param  {float} value
 * @return {integer}
 */
export default function ceil (value) {
	if (arguments.length < 2) {
		throw new Error('Helper "ceil" needs 1 parameter minimum');
	}

	return Math.ceil(parseFloat(value));
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{ceil a}}',
			input: { a: 1 },
			output: '1',
		},
		{
			template: '{{ceil a}}',
			input: { a: 0 },
			output: '0',
		},
		{
			template: '{{ceil a}}',
			input: { a: 0.1 },
			output: '1',
		},
		{
			template: '{{ceil a}}',
			input: { a: 0.55 },
			output: '1',
		},
		{
			template: '{{ceil a}}',
			input: { a: 5.6 },
			output: '6',
		},
	);
}
