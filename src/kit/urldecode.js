
import { safe } from '../utils';

/**
 * Parses URI encoded string back into its original format
 * @category strings
 * @name urldecode
 *
 * @signature {{urldecode input}}
 * @param  {string} input
 * @return {string}
 *
 * @signature {{#urldecode}}<TEMPLATE>{{/urldecode}}
 * @return {string}
 */
export default function urldecode (...args) {
	const { fn } = args.pop();

	if (fn) return decodeURIComponent(safe.down(fn()));

	if (args.length) {
		return decodeURIComponent(safe.down(args[0]));
	}

	throw new Error('Handlebars Helper "urldecode" needs 1 parameter minimum if not used as a block helper');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{{urldecode a}}}',
			input: { a: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B\'%22%5C' },
			output: 'praesent123~!@#$%^&*(){}[]=:/,;?+\'"\\',
		},
		{
			template: '{{urldecode a}}',
			input: { a: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B\'%22%5C' },
			output: 'praesent123~!@#$%^&amp;*(){}[]=:/,;?+&#39;&quot;\\',
		},
		{
			template: '{{#urldecode}}{{{a}}}{{/urldecode}}',
			input: { a: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B\'%22%5C' },
			output: 'praesent123~!@#$%^&amp;*(){}[]=:/,;?+&#39;&quot;\\',
		},
	);
}
