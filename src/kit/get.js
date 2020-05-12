
import { flatten, get as getUtil, MISSING } from '../utils';

/**
 * Returns the value at the object path defined via arguments
 * @category objects
 *
 * @signature {{get object path}}
 * @param  {object} value Value to test
 * @param  {string|Array<string>} path Path of the value to retrieve
 * @return {mixed}
 *
 * @signature {{#get value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/get}}
 * @describe Truthy block will evaluate with the result value as the current context ({this}).
 */

export default function get (...args) {
	if (args.length < 3) {
		throw new Error('Helper "get" needs a minimum of 3 arguments');
	}

	const { fn, inverse } = args.pop();
	const value = args.shift();
	if (!value) return '';

	if (args.length === 1) {
		args = args[0];
	} else {
		args = flatten(args);
	}

	const result = getUtil(value, args, MISSING);
	if (result === MISSING) return inverse ? inverse() : '';
	return fn ? fn(result) : result;
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{get object path1}}|{{get object path2}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path1: 'a.b',
				path2: [ 'a', 'b' ],
			},
			output: '2|2',
		},
		{
			template: '{{get object path1}}|{{get object path2}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path1: 'a.b',
				path2: 'a.c',
			},
			output: '2|',
		},
		{
			template: '{{get object path1}}|{{get object path2}}',
			input: {
				object: { 'a.b': 1, 'a': { 'b': 2 } },
				path1: 'a.b',
				path2: [ 'a.b' ],
			},
			output: '1|1',
		},
		{
			template: '{{get object path}}',
			input: {
				object: { 'a,b,c': 3, 'a': { 'b': { 'c': 4 } } },
				path: [ 'a', 'b', 'c' ],
			},
			output: '4',
		},
		{
			template: '{{#get object path}}{{this}}{{else}}no{{/get}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path: 'a.b',
			},
			output: '2',
		},
		{
			template: '{{#get object path}}{{this}}{{else}}no{{/get}}',
			input: {
				object: { 'a': { 'b': 2 } },
				path: 'a.c',
			},
			output: 'no',
		},
	);
}
