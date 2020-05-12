
import { ucfirst as uc, safe } from '../utils';


/**
 * Uppercase the first letter of a string or content block
 * @category strings
 * @name ucfirst
 *
 * @signature {{ucfirst input}}
 * @param  {string} input
 * @return {string}
 *
 * @signature {{#ucfirst}}<TEMPLATE>{{/ucfirst}}
 * @return {string}
 */
export default function ucfirst (...args) {
	const { fn } = args.pop();

	if (fn) return uc(safe.down(fn()));

	if (args.length) {
		return uc(safe.down(args[0]));
	}

	throw new Error('Handlebars Helper "ucfirst" needs 1 parameter minimum if not used as a block helper');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{ucfirst a}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et',
		},
		{
			template: '{{#ucfirst}}{{a}}{{/ucfirst}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et',
		},
	);
}
