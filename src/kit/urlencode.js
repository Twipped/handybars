
import { safe } from '../utils';

/**
 * Encodes a string into a URL safe format that can be decoded.
 * @category strings
 * @name urlencode
 *
 * @signature {{urlencode input}}
 * @param  {string} input
 * @return {string}
 *
 * @signature {{#urlencode}}<TEMPLATE>{{/urlencode}}
 * @return {string}
 */
export default function urlencode (...args) {
	const { fn } = args.pop();

	if (fn) return encodeURIComponent(safe.down(fn()));

	if (args.length) {
		return encodeURIComponent(args[0]);
	}

	throw new Error('Handlebars Helper "urlencode" needs 1 parameter minimum if not used as a block helper');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{{urlencode a}}}',
			input: { a: 'praesent123~!@#$%^&*(){}[]=:/,;?+\'"\\' },
			output: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B\'%22%5C',
		},
		{
			template: '{{urlencode a}}',
			input: { a: 'praesent123~!@#$%^&*(){}[]=:/,;?+\'"\\' },
			output: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B&#39;%22%5C',
		},
		{
			template: '{{#urlencode}}{{{a}}}{{/urlencode}}',
			input: { a: 'praesent123~!@#$%^&*(){}[]=:/,;?+\'"\\' },
			output: 'praesent123~!%40%23%24%25%5E%26*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B&#39;%22%5C',
		},
		{
			template: '{{#urlencode}}{{a}}{{/urlencode}}',
			input: { a: 'praesent123~!@#$%^&*(){}[]=:/,;?+\'"\\' },
			output: 'praesent123~!%40%23%24%25%5E%26amp%3B*()%7B%7D%5B%5D%3D%3A%2F%2C%3B%3F%2B%26%2339%3B%26quot%3B%5C',
		},
	);
}
