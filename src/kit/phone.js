

/**
 * Strips non-numeric characters and reformats as a US phone number (eg (XXX) XXX-XXXX)
 * Returns the value stripped of non-numerics if the result is not ten digits long
 * @category strings
 * @name phone
 *
 * @signature {{phone number}}
 * @param  {string|number} number
 * @return {string}
 */
export default function phone (number) {
	if (arguments.length === 1) {
		throw new Error('Helper "phoneNumber" needs 1 parameter minimum');
	}

	// strip non digits
	number = String(number).replace(/[^0-9]/, '');

	if (number.length < 10) {
		return number;
	}

	var stack = [ '(', number.substr(-10, 3), ') ', number.substr(-7, 3), '-', number.substr(-4) ];

	if (number.length > 10) {
		stack.unshift(number.substr(0, number.length - 10) + ' ');
	}

	return stack.join('');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{phone a}}',
			input: { a: 1 },
			output: '1',
		},
		{
			template: '{{phone a}}',
			input: { a: 1234567 },
			output: '1234567',
		},
		{
			template: '{{phone a}}',
			input: { a: 1234567890 },
			output: '(123) 456-7890',
		},
		{
			template: '{{phone a}}',
			input: { a: 123456789012 },
			output: '12 (345) 678-9012',
		},
	);
}
