
import { truthy } from '../utils';

/**
 * Evaluates the block contents if the passed input is truthy.
 *
 * @category default
 *
 * @signature {{#if input [target]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/if}}
 * @param  {mixed} input Value to test.
 * @param  {mixed} target Value to test against (strict equality). If omitted, helper will check if `input` is truthy.
 * @example
 * // name = { first: 'John', last: 'Doe' }
 * {{#if name}}<span>{{first}} {{last}}</span>{{/if}}
 * // Result: <span>John Doe</span>
 */
export default function _if (...args) {
	if (args.length < 1) throw new Error('Helper "if" needs a minimum of 1 arguments');
	const { scope, fn, inverse } = args.pop();
	const value = args.shift();
	const result = args.length ? value === args[0] : truthy(value);
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
			template: '{{if a 1}}',
			input: { a: 1 },
			output: 'true',
		},
		{
			template: '{{if a 2}}',
			input: { a: 1 },
			output: '',
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
