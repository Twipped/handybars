

/**
 * Pads a string with characters on the left side.
 * @category strings
 * @name padStart
 *
 * @signature {{padStart input length [using]}}
 * @param  {string} input
 * @param  {number} length
 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
 * @return {string}
 */
export default function padStart (...args) {
	args.pop();
	const [ input, length, using ] = args;

	return String(input).padStart(length, using);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{padStart a}}',
			input: { a: '1234567890' },
			output: '1234567890',
		},
		{
			template: '{{padStart a b}}',
			input: { a: '1234567890', b: 10 },
			output: '1234567890',
		},
		{
			template: '{{padStart a b}}',
			input: { a: '1234567890', b: 12 },
			output: '  1234567890',
		},
		{
			template: '{{{padStart a b c}}}',
			input: { a: '1234567890', b: 12, c: '.' },
			output: '..1234567890',
		},
		{
			template: '{{{padStart a b c}}}',
			input: { a: '1234567890', b: 13, c: 'abcdefg' },
			output: 'abc1234567890',
		},
	);
}
