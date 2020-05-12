
import { isArray, isString } from '../utils';

/**
 * Tests if the haystack ends with the needle value
 * @category strings
 * @name endsWith
 *
 * @signature {{endsWith haystack needle}}
 * @param  {string} haystack String to search inside
 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
 * @describe Returns true if the haystack ends with the needle
 * @return {boolean}
 *
 * @signature {{#endsWith haystack needle}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/endsWith}}
 * @param  {string} haystack String to search inside
 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
 * @describe If the string does contain that value, block will evaluate with the result value as the current scope.
 */
export default function endsWith (...args) {
	if (args.length !== 3) {
		throw new Error('Helper "endsWith" needs 2 parameters');
	}

	const { fn, inverse } = args.pop();
	const [ haystack, needle ] = args;
	let result;

	if (isArray(haystack)) {
		result = haystack[haystack.length - 1] === needle;
	} else if (isString(haystack)) {
		result = haystack.endsWith(needle);
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
			template: '{{endsWith a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'et' },
			output: 'true',
		},
		{
			template: '{{endsWith a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'es' },
			output: '',
		},
		{
			template: '{{#endsWith a b}}yes{{else}}no{{/endsWith}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'et' },
			output: 'yes',
		},
		{
			template: '{{#endsWith a b}}yes{{else}}no{{/endsWith}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'es' },
			output: 'no',
		},
	);
}
