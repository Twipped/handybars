

/**
 * Replaces the contents of a layout block with the contained content
 * @category layout
 * @name content
 *
 * @signature {{#block name}}<TEMPLATE>{{/block}}
 * @param  {string} name    Name of the block to fill
 * @return {null}
 */
export default function content (...args) {
	if (args.length === 1) {
		throw new Error('Helper "content" needs 1 parameter');
	}

	const { env, fn } = args.pop();
	const name = args[0];
	const root = env['@root'];

	root._blocks = root._blocks || {};

	root._blocks[name] = {
		mode: args[1] || 'replace',
		fn,
	};
}
/***/

