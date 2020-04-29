

export function makeFrame (data) {
	if (!data) return {};

	const frame = isObject(data) ? Object.create(data) : {};
	frame.this = data;
	frame['@parent'] = data;
	frame['@root'] = data['@root'] || data;
	return frame;
}

// htmlEscape copied from Sindre Sorhus' escape-goat
const htmlEscape = (input) => input
	.replace(/&/g, '&amp;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');

export function makeSafe (input) {
	if (isUndefinedOrNull(input)) return { value: '' };
	if (isStringType(input)) {
		return { value: input && htmlEscape(input) };
	}
	if (isObject(input) && hasOwn(input, 'value')) {
		return { value: input.value };
	}
	return { value: '' };
}

export function deSafe (input) {
	if (isUndefinedOrNull(input)) return '';
	if (isStringType(input)) {
		return input;
	}
	if (isObject(input) && hasOwn(input, 'value')) {
		return input.value;
	}
	return '';
}

export function isa (constructor) {
	return (input) => input instanceof constructor;
}

const uc = (str) => String(str).toUpperCase();

export function is (type, value) {
	const matchType = Array.isArray(type)
		? ((tok) => type.includes(tok.type))
		: ((tok) => tok[0] === type);

	if (arguments.length === 1) {
		return (tok, subvalue) => matchType(tok) &&
		(arguments.length === 1 || uc(tok[1]) === uc(subvalue));
	}

	if (typeof value == 'function') {
		return (tok) => matchType(tok) && value(tok[1]);
	}

	value = uc(value);
	return (tok) => matchType(tok) && uc(tok[1]) === value;
}

export function v (tok) {
	return tok[1];
}

export function isNumberType    (input) { return typeof input === 'number' && !isNaN(input); }
export function isStringType    (input) { return typeof input === 'string'; }
export function isFunctionType  (input) { return typeof input === 'function'; }
export function isUndefined     (input) { return typeof input === 'undefined'; }
export function isNull          (input) { return input === null; }
export function isUndefinedOrNull (input) { return isUndefined(input) || isNull(input); }
export function isNotUndefinedOrNull (input) { return !isUndefined(input) && !isNull(input); }
export function isMap           (input) { return input instanceof Map; }
export function isSet           (input) { return input instanceof Set; }
export const isArray = Array.isArray;
export function isObject (input) {
	if (!input) return false;
	if (typeof input !== 'object') return false;
	if (isArray(input)) return false;
	if (!(input instanceof Object)) return false;
	if (input.constructor !== Object.prototype.constructor) return false;
	return true;
}

export function hasOwn (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

export function get (obj, path, defaultValue) {
	if (isUndefinedOrNull(path) || path === '') return defaultValue;
	if (isNumberType(path)) path = [ String(path) ];
	else if (isStringType(path)) {
		if (hasOwn(obj, path)) return obj[path];
		path = path.split(/[,[\].]+?/);
	}

	const result = path
		.filter((s) => s !== null && !isUndefined(s) && s !== '')
		.reduce((res, key) =>
			((res !== null && !isUndefined(res)) ? res[key] : res)
		, obj);
	return (isUndefined(result) || result === obj) ? defaultValue : result;
}

export function has (obj, path) {
	if (isUndefinedOrNull(path) || path === '') return false;
	if (isNumberType(path)) path = [ String(path) ];
	else if (isStringType(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
	let res = obj;
	for (const key of path) {
		if (res === null || isUndefined(res)) return false;
		if (typeof res !== 'object' && typeof res !== 'function') return false;
		if (!hasOwn(res, key)) return false;
		res = res[key];
	}
	return true;
}

export function set (obj, path, value) {
	if (isUndefinedOrNull(path) || path === '') return false;
	if (isNumberType(path)) path = [ String(path) ];
	else if (isStringType(path)) {
		if (hasOwn(obj, path)) {
			obj[path] = value;
			return obj;
		}
		path = path.split(/[,[\].]+?/);
	}

	const c = path.length - 1;
	path
		.filter((s) => s || s === 0)
		.reduce((res, key, i) => {
			if (i === c) {
				res[key] = value;
				return true;
			}
			if (isObject(res[key]) || isFunctionType(res[key])) return res[key];
			return (res[key] = {});
		}, obj);

	return obj;
}

export function wtf (msg) {
	throw new Error(msg);
}

export function truthy (input) {
	return !!sizeOf(input);
}

export function arrayify (input) {
	if (isArray(input)) return input;

	if (isSet(input) || isMap(input)) return Array.from(input.values());

	if (isObject(input)) return Object.values(input);

	if (isStringType(input)) return input.split(/,\s*/);

	return [ input ];
}

export function all (...args) {
	let input;
	if (args.length > 1) {
		input = args;
	} else {
		input = arrayify(args[0]);
	}

	let result = input.shift();
	for (const value of input) {
		if (!truthy(result)) {
			return false;
		}
		result = value;
	}

	return result;
}

export function any (...args) {
	let input;
	if (args.length > 1) {
		input = args;
	} else {
		input = arrayify(args[0]);
	}

	for (const value of input) {
		if (truthy(value)) {
			return value;
		}
	}

	return input[input.length - 1];
}

export function isMappable (collection, arrays = true) {
	return (
		(arrays && isArray(collection)) ||
		(arrays && isSet(collection)) ||
		isMap(collection) ||
		collection && (typeof collection === 'object' || typeof collection === 'function')
	);
}

export function sizeOf (collection) {
	if (isUndefinedOrNull(collection)) return 0;
	if (isArray(collection) || isStringType(collection)) return collection.length;
	if (isSet(collection) || isMap(collection)) return collection.size;
	if (isObject(collection)) return Object.keys(collection).length;
	return !!collection;
}

export function iteratee (match) {
	if (isUndefined(match) || match === null) return Boolean;

	if (isFunctionType(match)) return match;

	if (isStringType(match)) {
		return (o) => {
			if (isArray(o)) return o.includes(match);
			if (isObject(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			return o === match;
		};
	}

	if (isNumberType(match)) {
		return (o) => {
			if (isObject(o) || isArray(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			return o === match;
		};
	}

	if (isArray(match)) {
		const [ key, value ] = match;
		return (o) => o[key] === value;
	}

	if (isObject(match)) {
		// create an array of key/value iteratees
		const tests = Object.entries(match).map(iteratee);
		// evaluate the object against the array
		return (o) => {
			for (const t of tests) {
				if (!t(o)) return false;
			}
			return true;
		};
	}
}

export function map (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		return collection.map((value, i) => predicate(value, i, i));
	}

	if (isSet(collection)) {
		return Array.from(collection, (value, i) => predicate(value, i, i));
	}

	if (isMap(collection)) {
		return Array.from(collection.entries(), ([ key, value ], index) => predicate(value, key, index));
	}

	if (isObject(collection)) {
		return Object.entries(collection).map(([ key, value ], index) => predicate(value, key, index));
	}

	if (isStringType(collection)) {
		return collection.split().map((value, i) => predicate(value, i, i));
	}

	return [];
}

export function mapValues (collection, predicate) {
	predicate = iteratee(predicate);
	return mapReduce(collection, (value, key, index) => [ key, predicate(value, key, index) ]);
}

export function mapReduce (collection, predicate) {
	if (!collection) return {};

	const result = {};
	function iterate (v, k, i) {
		// return true to continue looping
		const res = predicate(v, k, i) || [];
		if (res === false) return false;
		if (!res || !isArray(res)) return true;
		const [ key, value ] = res;
		if (isUndefinedOrNull(key) || isUndefined(value)) return true;
		result[key] = value;
		return true;
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (!iterate(value, i, i++)) break;
		}
		return result;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (!iterate(item, i, i++)) break;
		}
		return result;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (!iterate(value, key, i++)) break;
		}
		return result;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (!iterate(value, key, i++)) break;
		}
		return result;
	}

	return result;
}
