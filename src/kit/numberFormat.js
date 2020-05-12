
/**
 * Format a floating point number
 * @category strings
 * @name contains
 *
 * @signature {{numberFormat value [precision] [decimalPoint] [thousandsSeparator]}}
 * @param  {number} value
 * @param  {number} [precision]    Number of decimal points to display (default is 0)
 * @param  {string} [decimalPoint] Character to use for the decimal point (Default is a single period)
 * @param  {string} [thousandsSeparator]    Character to use to mark thousands (eg, 1,000) (Default is a single comma)
 * @return {string}
 */
export default function numberFormat (...args) {
	args.pop();

	if (!args.length) {
		throw new Error('Helper "numberFormat" needs 1 parameter minimum');
	}

	var [ value, precision = 0, decimalPoint = '.', thousands = ',' ] = args;

	// strip any non-numeric characters
	value = String(value).replace(/[^0-9+\-Ee.]/g, '');

	var result;
	if (precision) {
		// round at the needed precision and then split on the decimal.
		var k = Math.pow(10, precision);
		result = String(Math.round(value * k) / k).split('.');

		// if no decimal existed, make sure we create a place for it.
		if (result.length === 1) result.push('');
	} else {
		// parse as float and round off, then store in an array to simplify below.
		result = [ Math.round(parseFloat(value)) ];
	}

	// insert any thousands marks as needed
	if (thousands) {
		result[0] = String(result[0]).replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands);
	}

	// pad out the decimal places as needed
	if (precision && result[1].length < precision) {
		result[1] += new Array(precision - result[1].length + 1).join('0');
	}

	return precision ? result.join(decimalPoint) : result[0];
}
/***/

export function test (t) {
	t.multi(
		{
			template: '{{numberFormat a}}',
			input: { a: 1234.56 },
			output: '1,235',
		},
		{
			template: '{{numberFormat a b c d}}',
			input: { a: 1234.5678, b: '2', c: '.', d: '' },
			output: '1234.57',
		},
		{
			template: '{{numberFormat a b c d}}',
			input: { a: 1234.56, b: 2, c: ',', d: ' ' },
			output: '1 234,56',
		},
		{
			template: '{{numberFormat a b c d}}',
			input: { a: 67, b: 2, c: ',', d: '.' },
			output: '67,00',
		},
		{
			template: '{{numberFormat a}}',
			input: { a: 1000 },
			output: '1,000',
		},
		{
			template: '{{numberFormat a b}}',
			input: { a: 1000.55, b: 1 },
			output: '1,000.6',
		},
		{
			template: '{{numberFormat a b c d}}',
			input: { a: 67000, b: 5, c: ',', d: '.' },
			output: '67.000,00000',
		},
		{
			template: '{{numberFormat a b}}',
			input: { a: 0.9, b: 0 },
			output: '1',
		},
		{
			template: '{{numberFormat a b}}',
			input: { a: '1.20', b: 2 },
			output: '1.20',
		},
		{
			template: '{{numberFormat a b}}',
			input: { a: '1.20', b: 4 },
			output: '1.2000',
		},
		{
			template: '{{numberFormat a b}}',
			input: { a: '1.2000', b: 3 },
			output: '1.200',
		},
		{
			template: '{{numberFormat a b c d}}',
			input: { a: '1 000,50', b: 2, c: '.', d: ' ' },
			output: '100 050.00',
		},
	);
}
