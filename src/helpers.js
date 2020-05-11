
import {
	makeContext,
	safeJoin,
	truthy,
	sizeOf,
	get,
	has,
	all,
	any,
} from './utils';

const helpers = {};

helpers.get = helpers.lookup = (...args) => get(...args.slice(0, -1));

helpers.count = (...args) => sizeOf(...args.slice(0, -1));

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

helpers.not = helpers.unless = (...args) => {
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

helpers.isNot = (...args) => {
	const { data, fn, inverse } = args.pop();
	const value = args.shift();
	const result = !args.includes(value);
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
	const { env, fn, inverse, hash } = args.pop();
	if (!fn && !inverse) return '';
	if (!args.length) return '';
	const frame = makeContext(args[0], env, { hash });
	return truthy(scope) ? fn(frame) : inverse(frame);
};

helpers.each = (collection, ...args) => {
	const { env, fn, inverse, hash } = args.pop();
	if (!fn && !inverse) return;

	const c = sizeOf(collection);

	if (!c) {
		if (inverse) return inverse(frame);
		return '';
	}

	if (!fn) return safeJoin(collection);

	const frame = makeContext(collection, env, { hash });
	return safeJoin(collection, (value, key, index) => {
		frame.this = value;
		frame['@value'] = value;
		frame['@key'] = key;
		frame['@index'] = index;
		frame['@first'] = index === 0;
		frame['@last'] = index === c - 1;
		return fn(value, frame);
	});
};


export default helpers;
