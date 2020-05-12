
import { truthy, makeContext } from '../utils';

/**
 * Evaluates the block contents with a new scope.
 *
 * @category default
 *
 * @signature {{#with input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/with}}
 * @example
 * // name = { first: 'John', last: 'Doe' }
 * {{#with name}}<span>{{first}} {{last}}</span>{{/with}}
 * // Result: <span>John Doe</span>
 */
export default function _with (...args) {
	const { env, fn, inverse, hash } = args.pop();
	if (!fn && !inverse) return '';
	if (!args.length) return '';
	const [ scope ] = args;
	const frame = makeContext(scope, env, { hash });
	return truthy(scope) ? fn(scope, frame) : inverse();
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{with a}}',
			input: { a: { b: 1 } },
			output: '',
		},
		{
			template: '{{#with a}}{{this}}{{/with}}',
			input: { a: 'success' },
			output: 'success',
		},
		{
			template: '{{#with a}}failed{{else}}{{b}}{{/with}}',
			input: { b: 'success' },
			output: 'success',
		},
	);
}
