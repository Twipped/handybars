
import { safe } from '../utils';

/**
 * Defines a pluggable content block in a layout partial
 * @category layout
 * @name block
 *
 * @signature {{block name}}
 * @param  {string} name    Name of the block
 * @return {string} Defines an area for content to be inserted.`
 *
 * @signature {{#block name}}<TEMPLATE>{{/block}}
 * @param  {string} name    Name of the block
 * @return {string} Defines an area of content that can be appended, prepended, or replaced.`
 */
export default function block (...args) {
	if (args.length === 1) {
		throw new Error('Helper "block" needs 1 parameter');
	}

	var options = args.pop();
	const name = args[0];
	const root = options.env['@root'];

	root._blocks = root._blocks || {};

	var target = root._blocks[name];

	const fn = options.fn ? () => safe.down(options.fn()) : () => '';
	const tfn = target && target.fn ? () => safe.down(target.fn()) : () => '';

	var result;
	switch (target && target.fn && target.mode) {
	case 'append':
		result = fn() + tfn();
		break;
	case 'prepend':
		result = tfn() + fn();
		break;
	case 'replace':
		result = tfn();
		break;
	default:
		result = fn();
		break;
	}

	return { value: result };
}
/***/

