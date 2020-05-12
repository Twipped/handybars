
import { flatten } from '../utils';


/**
 * Finds the minimum of all passed values
 * @category math
 * @name min
 *
 * @signature {{min value1 value2 ... valueN}}
 * @param  {number} value1
 * @param  {number} value2
 * @param  {number} [valueN]
 * @return {number}
 */
export default function min (...args) {
	args.pop();

	if (!args.length) {
		throw new Error('Helper "max" needs at least 2 parameters');
	}

	return Math.min(...flatten(args));
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{min a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '1',
		},
		{
			template: '{{min a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '0',
		},
		{
			template: '{{min a}}',
			input: { a: [ -1, 0, 3 ] },
			output: '-1',
		},
	);
}
