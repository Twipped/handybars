
import { sizeOf, contextIterate, isString } from '../utils';

/**
 * Splits a string into an array.
 * May be used inline or as an iterator. Else condition will never evaluate.
 *
 * @category strings
 * @signature {{split input[ delimiter]}}
 * @param  {string} input
 * @param  {string} [delimiter] Defaults to ',' if not provided.
 * @return {array<string>}
 *
 * @signature {{#split input[ delimiter]}}<TEMPLATE>{{/split}}
 */
export default function split (...args) {

	const { fn, inverse, env, hash } = args.pop();
	const [ input, delimiter ] = args;

	if (!args.length) {
		throw new Error('Helper "split" needs at least 1 parameter');
	}

	if (!isString(input)) {
		console.trace('Helper "split" did not receive a string'); // eslint-disable-line no-console
		return '';
	}

	var results = input.split(delimiter);

	const c = sizeOf(results);
	if (!c) return inverse ? inverse() : results;
	if (!fn) return results;

	return contextIterate(results, env, fn, hash);

}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{split a ","}}',
			input: { a: '1,2,3' },
			output: '1,2,3',
		},
		{
			template: '{{#split a ","}}<{{this}}>{{else}}no{{/split}}',
			input: { a: '1,2,3' },
			output: '<1><2><3>',
		},
	);
}
