
import { flatten } from '../utils';

/**
 * Finds the maximum of all passed values
 * @category math
 * @name max
 *
 * @signature {{max value1 value2 ... valueN}}
 * @param  {number} value1
 * @param  {number} value2
 * @param  {number} [valueN]
 * @return {number}
 */
export default function max (...args) {
	args.pop();

	if (!args.length) {
		throw new Error('Helper "max" needs at least 2 parameters');
	}

	return Math.max(...flatten(args));
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{max a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '6',
		},
		{
			template: '{{max a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '3',
		},
		{
			template: '{{max a}}',
			input: { a: [ -1, 0, 3 ] },
			output: '3',
		},
	);
}
