
/**
 * Prepends the contained content onto a layout block.
 * @category layout
 * @name prepend
 *
 * @signature {{#prepend name}}<TEMPLATE>{{/prepend}}
 * @param  {string} name    Name of the content block to prepend to
 * @return {null}
 */
export default function prepend (...args) {
	if (args.length === 1) {
		throw new Error('Helper "prepend" needs 1 parameter');
	}

	const { env, fn } = args.pop();
	const name = args[0];
	const root = env['@root'];

	root._blocks = root._blocks || {};

	root._blocks[name] = {
		mode: 'prepend',
		fn,
	};
}
/***/

export function test () {
	// no tests
}
