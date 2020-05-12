
import { lc } from '../utils';

/**
 * Lowercase the a string or content block
 * @category strings
 * @name lowercase
 *
 * @signature {{lowercase input}}
 * @param  {string} input
 * @return {string}
 */
export default function lowercase (...args) {
	return lc(args.length > 1 ? args[0] : '');
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{lowercase a}}',
			input: { a: 'PRAESENT commodo CURSUS MAGNA, VEL scelerisque NISL CONSECTETUR ET' },
			output: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et',
		},
		{
			template: '{{lowercase a}}',
			input: { a: false },
			output: '',
		},
		{
			template: '{{lowercase}}',
			input: { a: 'nope' },
			output: '',
		},
	);
}
