import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';


/**
 * Outputs how much time has elapsed or will elapse between now and the passed date.
 * @category dates
 * @name fromNow
 *
 * @signature {{fromNow input [parseFormat]}}
 * @param {string|Date} input   The date value to be formatted. Must be either a Date object, parsable by Date(input), or parsable using a providing parsing string.
 * @param {string} [parseFormat] If a `parse` argument is provided, it will be used for instructing how to parse the input. See the `date-fns` library for parsing string formats.
 * @return {string}
 */

export default function fromNow (...args) {
	args.pop();
	let input;

	switch (args.length) {
	case 0:
		throw new Error('Helper "fromNow" needs at least 1 parameter');
	case 1:
		input = new Date(args[0]);
		break;
	case 2:
		input = parse(args[0], args[1]);
		break;
	default:
		return '';
	}

	if (!isValid(input)) {
		// console.trace('Invalid input for Handlebars Helper "fromNow"', { input, ...options.hash }); // eslint-disable-line
		return '';
	}

	return formatDistanceToNow(input, { addSuffix: true });
}
/***/


export function test (t) {
	const past = new Date(); past.setDate(past.getDate() - 70);
	const future = new Date(); future.setDate(future.getDate() + 14);

	t.multi(
		{
			template: '{{fromNow a}}',
			input: { a: past },
			output: '2 months ago',
		},
		{
			template: '{{fromNow a}}',
			input: { a: future },
			output: 'in 14 days',
		},
		{
			template: '{{fromNow a}}',
			input: { a: 'invalid' },
			output: '',
		},
		{
			template: '{{fromNow a}}',
			input: { a: '' },
			output: '',
		},
	);
}
