
import {
	makeFrame,
	truthy,
	map,
	isNotUndefinedOrNull,
	sizeOf,
	get,
	has,
	all,
	any,
} from './utils';

const helpers = {};

helpers.get = get;
helpers.count = sizeOf;

helpers.log = (...args) => {
	args.pop();
	console.log(...args); // eslint-disable-line
};

helpers.if = (...args) => {
	const { data, fn, inverse } = args.pop();
	const value = args.shift();
	const result = truthy(value);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.not = (...args) => {
	const { data, fn, inverse } = args.pop();
	const value = args.shift();
	const result = !truthy(value);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.has = (value, key, ...args) => {
	const { data, fn, inverse } = args.pop();
	const result = has(value, key);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.is = (...args) => {
	const { data, fn, inverse } = args.pop();
	const value = args.shift();
	const result = args.includes(value);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.all = (...args) => {
	const { data, fn, inverse } = args.pop();
	const result = all(...args);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.any = (...args) => {
	const { data, fn, inverse } = args.pop();
	const result = any(...args);
	if (!fn) return result || '';
	return result ? fn(data) : inverse(data);
};

helpers.with = (scope, ...args) => {
	const { data, fn, inverse } = args.pop();
	if (!fn && !inverse) return;
	const frame = makeFrame(data);
	return truthy(scope) ? fn(frame) : inverse(frame);
};

helpers.each = (collection, ...args) => {
	const { data, fn, inverse } = args.pop();
	if (!fn && !inverse) return;
	const frame = makeFrame(data);
	const c = sizeOf(collection);

	if (!c) {
		if (inverse) return inverse(frame);
		return '';
	}

	if (!fn) return '';

	return map(collection, (value, key, index) => {
		frame.this = value;
		frame['@value'] = value;
		frame['@key'] = key;
		frame['@index'] = index;
		frame['@first'] = index === 0;
		frame['@last'] = index === c - 1;
		return fn(frame);
	}).filter(isNotUndefinedOrNull).join('');
};


export default helpers;
