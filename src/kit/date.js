
import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

/**
 * Outputs a date formatted using moment notation.
 * Depends on the `moment` library. Moment will be searched for by first accessing a
 * `require` function (if present) before checking global contexts.
 * @category dates
 * @name date
 *
 * @signature {{date format}}
 * @describe Outputs the current date/time
 * @param  {string} format  Moment formatting
 * @return {string}
 *
 * @signature {{date input format [parse=<string>]}}
 * @param  {string} format  Moment formatting
 * @param  {string|Date} input   The date value to be formatted. Must be either a
 * Date object, parsable by Date(input), or parsable using a providing parsing string.
 * @param {string} [parse] If a `parse` attribute is provided, it will be used for
 * instructing moment on how to parse the input.
 * @return {string}
 */

export default function date (...args) {
	const options = args.pop();
	let format, input;

	switch (args.length) {
	case 0:
		format = 'yyyy-MM-dd HH:mm:ss';
		input = new Date();
		break;
	case 1:
		format = args[0];
		input = new Date();
		break;
	case 2:
		var parsePattern = options.hash && options.hash.parse;
		if (parsePattern) {
			input = parse(args[0], parsePattern, new Date());
		} else {
			input = new Date(args[0]);
		}
		format = args[1];
		break;
	default:
		return '';
	}

	if (!isValid(input)) {
		// console.trace('Invalid input for Handlebars Helper "date"', { input, ...options.hash }); // eslint-disable-line
		return '';
	}

	return dateFormat(input, format);
}

/***/


export function test (t) {
	t.multi(
		{
			template: '{{date}}',
			output: dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
		},
		{
			template: '{{date a}}',
			input: { a: 'MMM Mo, yyyy' },
			output: dateFormat(new Date(), 'MMM Mo, yyyy'),
		},
		{
			template: '{{date b a}}',
			input: { a: 'MMM Mo, yyyy', b: '1-1-2010' },
			output: 'Jan 1st, 2010',
		},
		{
			template: '{{date b a}}',
			input: { a: 'MMM do, yyyy', b: '2020-01-05T01:49:05.156Z' },
			output: 'Jan 4th, 2020',
		},
		{
			template: '{{date b a parse=c}}',
			input: { a: 'MMM do, yyyy', b: '12,02,2010', c: 'MM,dd,yyyy' },
			output: 'Dec 2nd, 2010',
		},
		{
			template: '{{date b a}}',
			input: { a: 'MMM Mo, yyyy', b: 'dsaADFASDF' },
			output: '',
		},
	);
}
