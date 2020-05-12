

/**
 * Generates a random number using Math.random()
 * @category math
 * @name random
 *
 * @signature {{random}}
 * @describe  Generates an random floating point between 0 and 1
 * @return {number}
 *
 * @signature {{random max}}
 * @describe Generates an integer between zero and the `max` value, or max and 0 if max is negative
 * @param  {number} max [description]
 * @return {number}
 *
 * @signature {{random min max}}
 * @describe Generates an integer between the `min` and `max` values
 * @param  {number} min  [description]
 * @param  {number} max [description]
 * @return {number}
 */
export default function random (min, max) {
	switch (arguments.length) {
	case 1:
		return Math.random();
	case 2:
		if (min > 0) {
			max = min;
			min = 0;
		} else {
			max = 0;
		}
		break;
	default:
		// do nothing
	}

	if (max === min) return max; // no need to do that math

	return Math.floor((Math.random() * (max - min )) + min);
}
/***/

export function test () {
	// no tests
}
