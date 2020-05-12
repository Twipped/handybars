
import { truthy } from '../utils';

/**
 * Evaluates the block contents if the passed input is truthy.
 *
 * @category default
 *
 * @signature {{#if input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/if}}
 * @example
 * // name = { first: 'John', last: 'Doe' }
 * {{#if name}}<span>{{first}} {{last}}</span>{{/if}}
 * // Result: <span>John Doe</span>
 */
export default function _if (...args) {
	const { scope, fn, inverse } = args.pop();
	const value = args.shift();
	const result = truthy(value);
	if (!fn) return result || '';
	return result ? fn(scope) : inverse && inverse();
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{if a}}',
			input: { a: { b: 1 } },
			output: 'true',
		},
		{
			template: '{{#if a}}{{a}}{{/if}}',
			input: { a: 'success' },
			output: 'success',
		},
		{
			template: '{{#if a}}failed{{else}}{{b}}{{/if}}',
			input: { b: 'success' },
			output: 'success',
		},
	);
}
