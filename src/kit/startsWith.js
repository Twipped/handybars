
import { isArray, isString } from '../utils';

/**
 * Tests if the haystack starts with the needle
 * @category strings
 * @name startsWith
 *
 * @signature {{startsWith haystack needle}}
 * @param  {string} haystack String to search inside
 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
 * @describe Returns true if the haystack ends with the needle
 * @return {boolean}
 *
 * @signature {{#startsWith haystack needle}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/startsWith}}
 * @param  {string} haystack String to search inside
 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
 */
export default function startsWith (...args) {
	if (args.length !== 3) {
		throw new Error('Handlebars Helper "endsWith" needs 2 parameters');
	}

	const { fn, inverse } = args.pop();
	const [ haystack, needle ] = args;
	let result;

	if (isArray(haystack)) {
		result = haystack[0] === needle;
	} else if (isString(haystack)) {
		result = haystack.startsWith(needle);
	} else {
		result = false;
	}

	if (!fn) {
		return result || '';
	}

	return result ? fn(this) : inverse && inverse(this);
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{startsWith a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'Pr' },
			output: 'true',
		},
		{
			template: '{{startsWith a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'pr' },
			output: '',
		},
		{
			template: '{{startsWith a b}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'ra' },
			output: '',
		},
		{
			template: '{{#startsWith a b}}yes{{else}}no{{/startsWith}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'Pr' },
			output: 'yes',
		},
		{
			template: '{{#startsWith a b}}yes{{else}}no{{/startsWith}}',
			input: { a: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et', b: 'ra' },
			output: 'no',
		},
	);
}
