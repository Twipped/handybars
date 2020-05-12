
/**
 * Converts the passed value into JSON.
 * Does not support block syntax.
 * @category collections
 * @name stringify
 *
 * @signature {{stringify input [pretty]}}
 * @param  {mixed} input    Value to be stringified
 * @param  {boolean} pretty Controls if the json should be tab indented.
 * @return {string} The formatted JSON.
 */

export default function stringify (...args) {
	args.pop();
	const [ input, pretty ] = args;

	if (!args.length) {
		throw new Error('Handlebars Helper "stringify" needs at least 1 parameter');
	}

	return { value: JSON.stringify(input, undefined, pretty) };
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{stringify a}}',
			input: { a: 1 },
			output: '1',
		},
		{
			template: '{{stringify a}}',
			input: { a: '1' },
			output: '"1"',
		},
		{
			template: '{{stringify a}}',
			input: { a: [ 'a', 'b' ] },
			output: '["a","b"]',
		},
		{
			template: '{{stringify a}}',
			input: { a: { b: 1, c: '2' } },
			output: '{"b":1,"c":"2"}',
		},
	);
}
