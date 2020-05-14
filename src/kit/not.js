
import { falsey } from '../utils';

/**
 * Evaluates the block contents of the passed input is falsey or equals a target.
 *
 * @category logic,default
 *
 * @signature {{#not input [target]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/not}}
 * @example
 * @param  {mixed} input Value to test.
 * @param  {mixed} target Value to test against (strict equality). If omitted, helper will check if `input` is falsey.
 * // name = { first: 'John', last: 'Doe' }
 * {{#not name}}No Name Defined{{else}}<span>{{first}} {{last}}</span>{{/not}}
 * // Result: <span>John Doe</span>
 */
export default function not (...args) {
	const { scope, fn, inverse } = args.pop();
	const value = args.shift();
	const result = args.length ? value !== args[0] : falsey(value);
	if (!fn) return result || '';
	return result ? fn(scope) : inverse && inverse();
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{not a}}',
			input: { a: { b: 1 } },
			output: '',
		},
		{
			template: '{{#not a}}success{{/not}}',
			input: { a: false },
			output: 'success',
		},
		{
			template: '{{#not a}}{{b}}{{else}}failed{{/not}}',
			input: { b: 'success' },
			output: 'success',
		},
	);
}
