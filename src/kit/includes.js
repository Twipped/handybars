
import { isArray, isString, isObject, hasOwn } from '../utils';

/**
 * Tests if the needle value exists inside the haystack
 * @category strings, collections
 * @name includes
 *
 * @signature {{includes haystack needle [regex=true]}}
 * @param  {string|Array<mixed>|object} haystack String or array to search inside, or object to check for key
 * @param  {string|RegExp|mixed} needle String to search for. If haystack is a string
 * and `regex=true` or needle is a RegExp, then the needle is evaluated as a regular expression.
 * If haystack is an object, needle is used as a key name.
 * @describe Returns true if the haystack contains the needle
 * @return {boolean}
 *
 * @signature {{#includes haystack needle [regex=true]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/includes}}
 * @param  {string} haystack String to search inside
 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
 */
export default function contains (...args) {
	if (args.length !== 3) {
		throw new Error('Helper "contains" needs 2 parameters');
	}

	const { fn, inverse, hash } = args.pop();
	const [ haystack, needle ] = args;
	let result;

	if (isArray(haystack)) {
		result = haystack.includes(needle);
	} else if (isString(haystack)) {
		if ((hash && hash.regex) || needle instanceof RegExp) {
			result = !!haystack.match(new RegExp(needle));
		} else {
			result = haystack.includes(needle);
		}
	} else if (isObject(haystack)) {
		result = hasOwn(haystack, needle);
	} else {
		result = false;
	}

	if (!fn) {
		return result || '';
	}

	return result ? fn() : inverse && inverse();

}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{includes a b}}',
			input: { a: [ 1, 2, 3 ], b: 2 },
			output: 'true',
		},
		{
			template: '{{includes a b}}',
			input: { a: [ 1, 2, 3 ], b: 0 },
			output: '',
		},
		{
			template: '{{#includes a b}}yes{{else}}no{{/includes}}',
			input: { a: [ 1, 2, 3 ], b: 1 },
			output: 'yes',
		},
		{
			template: '{{#includes a b}}yes{{else}}no{{/includes}}',
			input: { a: [ 1, 2, 3 ], b: 4 },
			output: 'no',
		},
		{
			template: '{{includes a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', b: 'is' },
			output: 'true',
		},
		{
			template: '{{includes a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', b: 'ex' },
			output: '',
		},
		{
			template: '{{#includes a b}}yes{{else}}no{{/includes}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', b: 'is' },
			output: 'yes',
		},
		{
			template: '{{#includes a b}}yes{{else}}no{{/includes}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', b: 'ex' },
			output: 'no',
		},
	);
}
