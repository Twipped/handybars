

/**
 * Pads a string with characters on the right side.
 * @category strings
 * @name padEnd
 *
 * @signature {{padEnd input length [using]}}
 * @param  {string} input
 * @param  {number} length
 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
 * @return {string}
 */
export default function padEnd (...args) {
	args.pop();
	const [ input, length, using ] = args;

	return String(input).padEnd(length, using);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{padEnd a}}',
			input: { a: '1234567890' },
			output: '1234567890',
		},
		{
			template: '{{padEnd a b}}',
			input: { a: '1234567890', b: 10 },
			output: '1234567890',
		},
		{
			template: '{{padEnd a b}}',
			input: { a: '1234567890', b: 12 },
			output: '1234567890  ',
		},
		{
			template: '{{{padEnd a b c}}}',
			input: { a: '1234567890', b: 12, c: '.' },
			output: '1234567890..',
		},
		{
			template: '{{{padEnd a b c}}}',
			input: { a: '1234567890', b: 13, c: 'abcdef' },
			output: '1234567890abc',
		},
	);
}
