

/**
 * Rounds the passed floating point to the nearest whole number
 * @category math
 * @name round
 *
 * @signature {{round value}}
 * @param  {number} value
 * @return {number}
 */
export default function round (value) {
	if (arguments.length < 2) {
		throw new Error('Handlebars Helper "round" needs 1 at least parameter');
	}

	return Math.round(value);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{round a}}',
			input: { a: 1 },
			output: '1',
		},
		{
			template: '{{round a}}',
			input: { a: 0 },
			output: '0',
		},
		{
			template: '{{round a}}',
			input: { a: 0.1 },
			output: '0',
		},
		{
			template: '{{round a}}',
			input: { a: 0.55 },
			output: '1',
		},
		{
			template: '{{round a}}',
			input: { a: 5.6 },
			output: '6',
		},
	);
}
