
import { flatten, has as hasUtil } from '../utils';

/**
 * Tests if a value exists at the object path defined via arguments
 * @category objects
 *
 * @signature {{get object path}}
 * @param  {object} value Value to test
 * @param  {string|Array<string>} path Path of the value to retrieve
 * @return {boolean}
 *
 * @signature {{#has value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/has}}
 * @describe Truthy block will evaluate with the result value as the current context ({this}).
 */

export default function has (...args) {
	if (args.length < 3) {
		throw new Error('Helper "has" needs a minimum of 3 arguments');
	}

	const { fn, inverse } = args.pop();
	const value = args.shift();
	if (args.length === 1) {
		args = args[0];
	} else {
		args = flatten(args);
	}

	const result = hasUtil(value, args);
	if (!fn) return result || '';
	return result ? fn() : inverse && inverse();
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{has object path1}}|{{has object path2}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path1: 'a.b',
				path2: [ 'a', 'b' ],
			},
			output: 'true|true',
		},
		{
			template: '{{has object path1}}|{{has object path2}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path1: 'a.b',
				path2: 'a.c',
			},
			output: 'true|',
		},
		{
			template: '{{has object path}}',
			input: {
				object: { 'a,b,c': 3, 'a': { 'b': { 'c': 4 } } },
				path: [ 'a', 'b', 'c' ],
			},
			output: 'true',
		},
		{
			template: '{{#has object path}}yes{{else}}no{{/has}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path: 'a.b',
			},
			output: 'yes',
		},
		{
			template: '{{#has object path}}{{this}}{{else}}no{{/has}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path: 'a.c',
			},
			output: 'no',
		},
	);
}
