
import { ucsentence as uc, safe } from '../utils';


/**
 * Uppercase the first letter of every sentence in a string or content block
 * @category strings
 * @name ucsentences
 *
 * @signature {{ucsentences input}}
 * @param  {string} input
 * @return {string}
 *
 * @signature {{#ucsentences}}<TEMPLATE>{{/ucsentences}}
 * @return {string}
 */
export default function ucsentences (...args) {
	const { fn } = args.pop();

	if (fn) return { value: uc(safe.down(fn())) };

	if (args.length) {
		return uc(safe.down(args[0]));
	}

	throw new Error('Handlebars Helper "ucsentences" needs 1 parameter minimum if not used as a block helper');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{ucsentences a}}',
			input: { a: 'praesent commodo cursus magna. vel scelerisque nisl consectetur et' },
			output: 'Praesent commodo cursus magna. Vel scelerisque nisl consectetur et',
		},
		{
			template: '{{#ucsentences}}{{a}}{{/ucsentences}}',
			input: { a: 'praesent commodo cursus magna. vel scelerisque nisl consectetur et' },
			output: 'Praesent commodo cursus magna. Vel scelerisque nisl consectetur et',
		},
	);
}
