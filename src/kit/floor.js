
/**
 * Rounds down the passed value
 * @category math
 * @name  floor
 *
 * @signature {{ceil value}}
 * @param  {float} value
 * @return {integer}
 */

export default function floor (value) {
	if (arguments.length < 2) {
		throw new Error('Helper "floor" needs 1 parameter minimum');
	}

	return Math.floor(value);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{floor a}}',
			input: { a: 1 },
			output: '1',
		},
		{
			template: '{{floor a}}',
			input: { a: 0 },
			output: '0',
		},
		{
			template: '{{floor a}}',
			input: { a: 0.1 },
			output: '0',
		},
		{
			template: '{{floor a}}',
			input: { a: 0.55 },
			output: '0',
		},
		{
			template: '{{floor a}}',
			input: { a: 5.6 },
			output: '5',
		},
	);
}
