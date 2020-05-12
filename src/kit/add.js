
import { flatten } from '../utils';

/**
 * Add all values provided and return the result
 * @category math
 * @name add
 *
 * @signate {{add value1 value2 ... valueN}}
 * @param {...Array<number>|number} values Numbers or arrays of numbers to be added together
 * @return {number}
 */
export default function add (...args) {
	args.pop();

	if (!args.length) {
		throw new Error('Helper "add" needs at least 1 argument');
	}

	return flatten(args).reduce((a, b) => a + b, 0);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{add a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '21',
		},
		{
			template: '{{add a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '6',
		},
		{
			template: '{{add a}}',
			input: { a: [ 1, 2, 3 ] },
			output: '6',
		},
	);
}
