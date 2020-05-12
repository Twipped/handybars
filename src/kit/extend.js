
import { makeContext, isFunction, safe, wtf } from '../utils';

/**
 * Defines collection of layout cells to be filled into a layout partial. This function wraps a
 * series of `append`, `prepend` and `content` calls. The content instructions inside are evaluated
 * and then the named partial is evaluated using the data defined by those instructions. All other
 * contained text is disposed of.
 * @category layout
 * @name extend
 *
 * @signature {{#extend name}}<TEMPLATE>{{/extend}}
 * @param  {string} layout  The name of the partial or function to use.
 * @return {string}
 */
export default function extend (...args) {
	if (args.length === 1) {
		throw new Error('Helper "extend" needs 1 parameter');
	}

	const options = args.pop();
	const { scope, env, fn, resolve, hash } = options;
	const name = args[0];

	var template = resolve(name);

	if (!template) {
		throw new Error("Missing layout: '" + name + "'");
	}

	if (fn) {
		// run the contents of the embed so that the content blocks apply
		// but don't use the output.
		fn();
	}

	if (isFunction(template.evaluate)) {
		const source = args.length ? args[0] : scope;
		const frame = makeContext(source, env, { hash });
		return template.evaluate(source, frame);
	}

	if (isFunction(template)) return safe.up(template(options));
	console.error({ template });
	wtf('Layout is not a partial or a function.');
}
/***/

export function test () {
	// no tests
}
