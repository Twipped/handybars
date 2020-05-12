

/**
 * Sends the passed arguments to console.log
 * @name log
 * @category debug
 *
 * @signature {{log}}
 * @return {null} Sends the current context to console.log
 *
 * @signature {{log argument1 ... argumentN}}
 * @param  {...mixed} args Arguments to send to console.log
 * @return {null}
 */
export default function log (...args) {
	const { env } = args.pop();
	if (!args.length) args = [ env ];
	console.log(...args); // eslint-disable-line no-console
}
/***/
