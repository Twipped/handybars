
import { flatten, isArray } from '../utils';

/**
 * Multiplies two or more values.
 * If more than two values are provided, the result of the previous two multiplications
 * will be divided with the next. If any value is 0, the result of the division will be zero.
 * @category math
 * @name mul
 *
 * @signature {{mul value1 value2 ... valueN}}
 * @param  {number} value1
 * @param  {number} value2
 * @param  {number} [valueN]
 * @return {number}
 */
export default function mul (...args) {
	args.pop();

	if (args.length < 2 && !isArray(args[0])) {
		throw new Error('Handlebars Helper "mul" needs 2 parameters minimum');
	}

	args = flatten(args);

	const initial = args.shift();
	return args.reduce((a, b) => a * b, initial);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{mul a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '720',
		},
		{
			template: '{{mul a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '0',
		},
		{
			template: '{{mul a}}',
			input: { a: [ 1, 2, 3 ] },
			output: '6',
		},
	);
}
