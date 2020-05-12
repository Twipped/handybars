
import { uc, safe } from '../utils';

/**
 * Uppercase the a string or content block
 * @category strings
 * @name uppercase
 *
 * @signature {{uppercase input}}
 * @param  {string} input
 * @return {string}
 *
 * @signature {{#uppercase}}<TEMPLATE>{{/uppercase}}
 * @return {string}
 */
export default function uppercase (...args) {
	const { fn } = args.pop();

	if (fn) return uc(safe.down(fn()));

	if (args.length) {
		return uc(safe.down(args[0]));
	}

	throw new Error('Helper "uppercase" needs 1 parameter minimum if not used as a block helper');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{uppercase a}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'PRAESENT COMMODO CURSUS MAGNA, VEL SCELERISQUE NISL CONSECTETUR ET',
		},
		{
			template: '{{#uppercase}}{{a}}{{/uppercase}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'PRAESENT COMMODO CURSUS MAGNA, VEL SCELERISQUE NISL CONSECTETUR ET',
		},
	);
}
