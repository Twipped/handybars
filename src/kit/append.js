

/**
 * Appends the contained content to a layout block
 * @category layout
 * @name append
 *
 * @signature {{#append name}}<TEMPLATE>{{/append}}
 * @param  {string} name    Name of the content block to append to
 * @return {null}
 */
export default function append (...args) {
	if (args.length === 1) {
		throw new Error('Helper "append" needs 1 parameter');
	}

	const { env, fn } = args.pop();
	const name = args[0];
	const root = env['@root'];

	root._blocks = root._blocks || {};

	root._blocks[name] = {
		mode: 'append',
		fn,
	};
}
/***/

export function test () {
	// no tests
}
