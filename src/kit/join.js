
import { safeJoin, sizeOf, makeContext } from '../utils';

/**
 * Joins all elements of a collection into a string using a separator if specified.
 * If used as an iterator block, the block contents will be used as a replacement for the item in the array, and then output after joined.
 * Else condition evaluates if result is empty.
 *
 * @category collections
 * @signature {{join items[ separator]}}
 * @param  {array<mixed>} input
 * @param  {string} [separator] Defaults to `','`
 * @return {string}
 *
 * @signature {{#join items[ separator]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/join}}
 */
export default function join (...args) {
	if (args.length === 1) {
		throw new Error('Helper "join" needs at least one parameter');
	}

	const { fn, inverse, env, hash } = args.pop();
	const input = args[0];
	const delimiter = args.length === 2 ? args[1] : ', ';
	const c = sizeOf(input);

	if (!c) return inverse && inverse();

	if (!fn) return safeJoin(input, null, delimiter);

	var frame = makeContext(input, env, { hash });
	return safeJoin(input, (value, key, index) => {
		frame.this = value;
		frame['@value'] = value;
		frame['@key'] = key;
		frame['@index'] = index;
		frame['@first'] = index === 0;
		frame['@last'] = index === c - 1;
		return fn(value, frame);
	}, delimiter);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{join a}}',
			input: { a: [ 1, 2, 3 ] },
			output: '1, 2, 3',
		},
		{
			template: '{{join a "-"}}',
			input: { a: [ 1, 2, 3 ] },
			output: '1-2-3',
		},
		{
			template: '{{join a ""}}',
			input: { a: [ 1, 2, 3 ] },
			output: '123',
		},
		{
			template: '{{#join a "|"}}<{{this}}>{{else}}no{{/join}}',
			input: { a: [ 1, 2, 3 ] },
			output: '<1>|<2>|<3>',
		},
		{
			template: '{{#join a "|"}}<{{this}}>{{else}}no{{/join}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
