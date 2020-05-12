
import { isUndefined } from '../utils';

/**
 * Converts a whole number into an abbreviated form (eg, 1200000 into 1.2M)
 * @category strings
 * @name number
 *
 * @signature {{number value [precision]}}
 * @param  {number} value
 * @param  {number} precision Optional number of decimal places to abbreviate to (default is 0)
 * @return {string}
 */
export default function number (...args) {
	const options = args.pop();

	if (!args.length) {
		throw new Error('Helper "number" needs at least 1 parameter');
	}

	const [ value, precision, grouping ] = args;

	const { locale, currency } = options.hash;

	return !isNaN(value) && Number(value).toLocaleString(locale, {
		style: currency ? 'currency' : 'decimal',
		minimumFractionDigits: precision || 0,
		maximumFractionDigits: precision || 0,
		useGrouping: isUndefined(grouping) ? true : grouping,
		locale,
		currency,
	}) || '';
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{number a}}',
			input: { a: 1234.56 },
			output: '1,235',
		},
		{
			template: '{{number a b false}}',
			input: { a: 1234.5678, b: '2' },
			output: '1234.57',
		},
		{
			template: '{{number a b currency=c}}',
			input: { a: 1234.56, b: 2, c: 'USD' },
			output: '$1,234.56',
		},
		{
			template: '{{number a}}',
			input: { a: 1000 },
			output: '1,000',
		},
		{
			template: '{{number a b}}',
			input: { a: 1000.55, b: 1 },
			output: '1,000.6',
		},
		{
			template: '{{number a b }}',
			input: { a: 67000, b: 5 },
			output: '67,000.00000',
		},
		{
			template: '{{number a b}}',
			input: { a: 0.9, b: 0 },
			output: '1',
		},
		{
			template: '{{number a b}}',
			input: { a: '1.20', b: 2 },
			output: '1.20',
		},
		{
			template: '{{number a b}}',
			input: { a: '1.20', b: 4 },
			output: '1.2000',
		},
		{
			template: '{{number a b}}',
			input: { a: '1.2000', b: 3 },
			output: '1.200',
		},
		{
			template: '{{number a b}}',
			input: { a: '1 000,50', b: 2 },
			output: '',
		},
	);
}
