

/**
 * Converts a byte count into a human readable format
 * Example: 1624 becomes 1.6KB
 * @category strings
 * @name bytes
 *
 * @signature {{bytes bytecount}}
 * @param  {number} bytecount
 * @return {string}
 */
export default function bytes (value) {
	var bytecount = Math.abs(parseFloat(value));
	if (isNaN(bytecount)) {
		// console.error("Handlebars helper bytes couldn't parse '" + value + "'");
		return ''; // Graceful degradation
	}

	var resInt, resValue;
	var metric = [ 'byte', 'bytes', 'KB', 'MB', 'GB', 'TB' ];
	if (bytecount === 0) {
		resInt = resValue = 0;
	} else {
		// Base 1000 (rather than 1024) matches Mac OS X
		resInt = Math.floor(Math.log(bytecount) / Math.log(1000));
		// No decimals for anything smaller than 1 MB
		resValue = (bytecount / Math.pow(1000, Math.floor(resInt)));
		// Only show a decimal place if the decimal will round to something other than .0
		resValue = resValue.toFixed(resValue % 1 > 0.1 ? 1 : 0);
		if (bytecount === 1) {
			resInt = -1; // special case: 1 byte (singular)
		}
	}
	if (resInt + 1 < metric.length) {
		return resValue + ' ' + metric[resInt + 1];
	}

	// The number we have is higher than our highest unit, so express it as a value of our highest unit
	return (resValue * Math.pow(10, metric.length + 2 - resInt)) + ' ' + metric[metric.length - 1];
}
/***/


export function test (t) {
	t.multi(
		{
			template: '{{bytes a}}',
			input: { a: 1 },
			output: '1 byte',
		},
		{
			template: '{{bytes a}}',
			input: { a: -1 },
			output: '1 byte',
		},
		{
			template: '{{bytes a}}',
			input: { a: 2 },
			output: '2 bytes',
		},
		{
			template: '{{bytes a}}',
			input: { a: 1100 },
			output: '1.1 KB',
		},
		{
			template: '{{bytes a}}',
			input: { a: 150001 },
			output: '150 KB',
		},
		{
			template: '{{bytes a}}',
			input: { a: 15000001 },
			output: '15 MB',
		},
		{
			template: '{{bytes a}}',
			input: { a: 1500000001 },
			output: '1.5 GB',
		},
		{
			template: '{{bytes a}}',
			input: { a: 15000000000001 },
			output: '15 TB',
		},
		{
			template: '{{bytes a}}',
			input: { a: 1000000000000001 },
			output: '1000 TB',
		},
	);
}
