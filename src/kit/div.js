
import { isArray, isUndefined } from '../utils';

/**
 * Divides two or more values.
 * If more than two values are provided, the result of the previous two division will be divided with the next.
 * If any value is 0, the result of the division will be zero.
 * @category math
 * @name div
 *
 * @signature {{div value1 value2 ... valueN}}
 * @param  {number} value1
 * @param  {number} value2
 * @param  {number} [valueN]
 * @return {number}
 */
export default function div (...args) {
	args.pop();

	if (!args.length) {
		throw new Error('Helper "div" needs 1 parameter minimum');
	}

	let value;
	function descend (level) {
		if (isArray(level)) {
			level.forEach(descend);
		} else if (isUndefined(value)) {
			value = parseFloat(level);
		} else if (level) {
			level = parseFloat(level);
			value = level ? (value / level) : 0;
		}
	}

	descend(args);

	return value;
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{div a b c d}}',
			input: { a: [ 10000, 2 ], b: 4, c: 5 },
			output: '250',
		},
		{
			template: '{{div a b}}',
			input: { a: 10000, b: 0 },
			output: '10000', // ignores non-divisable values
		},
		{
			template: '{{div a}}',
			input: { a: [ 100, 2, 4 ] },
			output: '12.5',
		},
		{
			template: '{{div a b}}',
			input: { a: 10, b: 2 },
			output: '5',
		},
	);
}
