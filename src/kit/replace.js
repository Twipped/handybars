
import { safe } from '../utils';

/**
 * Searches for a needle within a haystack and substitutes a replacement for all matchs.
 * @category strings
 * @name replace
 *
 * @signature {{replace haystack needle replacement regex}}
 * @param  {string} haystack
 * @param  {string|RegExp} needle
 * @param  {string} replacement
 * @param  {boolean} [regex] Pass true to evaluate needle as a regular expression
 * @return {string}
 */
export default function replace (...args) {
	const { fn } = args.pop();
	let haystack;
	if (fn) haystack = safe.down(fn());
	else haystack = String(args.shift());

	const needle = args[2] ? new RegExp(args[0]) : args[0];
	const replacement = args[1] || '';
	const regex = needle instanceof RegExp;

	return regex ? haystack.replace(needle, replacement) : haystack.split(needle).join(replacement);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{replace a b c}}',
			input: { a: 'abcdef', b: 'cd', c: 'xy' },
			output: 'abxyef',
		},
		{
			template: '{{replace a b}}',
			input: { a: 'abcdef', b: 'cd' },
			output: 'abef',
		},
		{
			template: '{{#replace a b}}abcdef{{/replace}}',
			input: { a: 'cd', b: 'xy' },
			output: 'abxyef',
		},
		{
			template: '{{#replace a}}abcdef{{/replace}}',
			input: { a: 'cd' },
			output: 'abef',
		},
	);
}
