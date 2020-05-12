
import { flatten, isArray } from '../utils';


/**
 * Subtracts one or more values from the first value
 * If more than two values are provided, the result of the previous subtraction will be subtracted from the next.
 * @category math
 * @name sub
 *
 * @signature {{sub value1 value2 ... valueN}}
 * @param  {number} value1
 * @param  {number} value2
 * @param  {number} [valueN]
 * @return {number}
 */
export default function sub (...args) {
	args.pop();

	if (args.length < 2 && !isArray(args[0])) {
		throw new Error('Helper "sub" needs 1 parameter minimum');
	}

	args = flatten(args);

	const initial = args.shift();
	return args.reduce((a, b) => a - b, initial);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{sub a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '-19',
		},
		{
			template: '{{sub a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '-4',
		},
		{
			template: '{{sub a}}',
			input: { a: [ 1, 2, 3 ] },
			output: '-4',
		},
		{
			template: '{{sub a b}}',
			input: { a: 10, b: 2 },
			output: '8',
		},
	);
}
