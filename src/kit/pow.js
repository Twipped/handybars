

/**
 * Returns the base to the exponent power
 * @category math
 * @name pow
 *
 * @signature {{pow base exponent}}
 * @param  {number} base
 * @param  {number} exponent
 * @return {number}
 */
export default function pow (base, exponent) {
	if (arguments.length < 3) {
		throw new Error('Helper "pow" needs at least 2 parameters');
	}

	return Math.pow(base, exponent);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{pow a b}}',
			input: { a: 10, b: 4 },
			output: '10000',
		},
		{
			template: '{{pow a b}}',
			input: { a: 6, b: 0 },
			output: '1',
		},
		{
			template: '{{pow a b}}',
			input: { a: 6, b: 1 },
			output: '6',
		},
	);
}
