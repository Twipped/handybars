
export { default as slugify } from './slugify';

export const MISSING = '{!MISSING!}';

// htmlEscape copied from Sindre Sorhus' escape-goat
export const htmlEscape = (input) => input
	.replace(/&/g, '&amp;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');


export function makeContext (scope, env, { hash = null } = {}) {
	const frame = env ? Object.create(env) : {};

	if (hash) Object.assign(frame, hash);

	frame.this = scope;
	frame['@env'] = frame;
	frame['@value'] = scope;
	frame['@parent'] = env;
	frame['@root'] = env['@root'] || frame;

	return frame;
}

export function contextIterate (input, env, fn, hash) {
	var frame = makeContext(input, env, { hash });
	const c = sizeOf(input);
	return safeJoin(input, (value, key, index) => {
		frame.this = value;
		frame['@value'] = value;
		frame['@key'] = key;
		frame['@index'] = index;
		frame['@first'] = index === 0;
		frame['@last'] = index === c - 1;
		return fn(value, frame);
	});
}

export const SAFE_NONE = 0;
export const SAFE_WRAPPED = 1;
export const SAFE_ESCAPED = 2;

export function safe (input, level = SAFE_WRAPPED) {
	if (isUndefinedOrNull(input) || isFalse(input)) {
		if (level === SAFE_NONE) return input;
		return { value: '', safety: level };
	}
	if (isString(input)) {
		if (level === SAFE_NONE) return input;
		if (level === SAFE_WRAPPED) return { value: input, safety: level };
		if (level === SAFE_ESCAPED) return { value: input && htmlEscape(input) };
	}
	if (isObject(input) && hasOwn(input, 'value')) {
		if (level === SAFE_NONE) return input.value;
		return { value: input.value, safety: level };
	}

	if (level === SAFE_NONE) return input;
	return { value: input, safety: level };
}

safe.NONE    = SAFE_ESCAPED;
safe.WRAPPED = SAFE_WRAPPED;
safe.ESCAPED = SAFE_ESCAPED;

safe.down = (input) => safe(input, SAFE_NONE);
safe.up   = (input) => safe(input, SAFE_ESCAPED);

export function safeJoin (inputs, predicate, delimiter = '') {
	predicate = iteratee(predicate);
	return { value: map(inputs, (val, k, i) => safe.up(predicate(val, k, i)).value).join(delimiter) };
}

export function wtf (msg, info) {
	if (info) console.error(info); // eslint-disable-line no-console
	throw new Error(msg);
}

export function cl (...args) {
	return args.flat().filter(Boolean).join(' ');
}

export function equals (value) {
	value = uc(value);
	return (tok) => uc(tok) === value;
}

export function re (pattern) {
	if (isString(pattern)) pattern = new RegExp(pattern);
	return (tok) => !!String(tok).match(pattern);
}

export function anyOf (...args) {
	args = args.flat().map(uc);
	if (!anyBy(args, isFunction)) {
		// arguments do not contain a function, so we can optimize
		if (args.length === 1) return (tok) => uc(tok) === args[0];
		return (tok) => args.includes(uc(tok));
	}

	args = args.map((a) => isFunction(a) && a || equals(a));
	if (args.length === 1) return (tok) => args[0](tok);
	return (tok) => anyBy(args, (check) => check(tok));
}

export function allOf (...args) {
	args = args.flat().map((a) => isFunction(a) && a || equals(a));
	if (args.length === 1) return (tok) => args[0](tok);
	return (tok) => allBy(args, (check) => check(tok));
}

export function isNumber        (input) { return typeof input === 'number' && !isNaN(input); }
export function isString        (input) { return typeof input === 'string'; }
export function isBoolean       (input) { return typeof input === 'boolean'; }
export function isFunction      (input) { return typeof input === 'function'; }
export function isNull          (input) { return input === null; }
export function isUndefined     (input) { return typeof input === 'undefined'; }
export function isUndefinedOrNull (input) { return isUndefined(input) || isNull(input); }
export function isNotUndefinedOrNull (input) { return !isUndefined(input) && !isNull(input); }
export function isMap           (input) { return input instanceof Map; }
export function isSet           (input) { return input instanceof Set; }
export function isDate          (input) { return input instanceof Date; }
export function isRegExp        (input) { return input instanceof RegExp; }
export function isTrue          (input) { return input === true; }
export function isTruthy        (input) { return !!input; }
export function isFalsey        (input) { return  !input; }
export function isFalse         (input) { return input === false; }
export function isList (input) { return isArray(input) || isSet(input); }
export function isDict (input) { return isObject(input) || isMap(input); }
export const isArray = Array.isArray;

export function isPrimitive (input) {
	switch (typeof input) {
	case 'string':
	case 'number':
	case 'boolean':
		return true;
	default:
		return false;
	}
}

export function isObject (input) {
	if (!input) return false;
	if (typeof input !== 'object') return false;
	if (isArray(input)) return false;
	if (!(input instanceof Object)) return false;
	if (input.constructor !== Object.prototype.constructor) return false;
	return true;
}

export function isa (constructor) {
	return (input) => input instanceof constructor;
}

const IS_LOOKUP = new Map([
	[ Array,     isArray     ],
	[ Number,    isNumber    ],
	[ String,    isString    ],
	[ Boolean,   isBoolean   ],
	[ Map,       isMap       ],
	[ Set,       isSet       ],
	[ Function,  isFunction  ],
	[ Date,      isDate      ],
	[ RegExp,    isRegExp    ],
	[ undefined, isUndefined ],
	[ true,      isTruthy    ],
	[ false,     isFalsey    ],
]);

export function is (...args) {
	args = args.flat().map((a) =>
		IS_LOOKUP.get(a)
		|| (isFunction(a) && a)
		|| (isRegExp(a) && re(a))
		|| equals(a),
	);
	if (args.length === 1) return (tok) => args[0](tok);
	return (tok) => anyBy(args, (check) => check(tok));
}

export function isAll (...args) {
	args = args.flat().map((a) =>
		IS_LOOKUP.get(a)
		|| (isFunction(a) && a)
		|| (isRegExp(a) && re(a))
		|| equals(a),
	);
	if (args.length === 1) return (tok) => args[0](tok);
	return (tok) => allBy(args, (check) => check(tok));
}

export function tableLookup (dict, def) {
	const arr = Object.entries(dict);

	return (tok) => {
		for (const [ key, value ] of arr) {
			if (isFunction(value) ? value(tok) : tok === value) return key;
		}
		return def;
	};
}

export function isArrayOf (...args) {
	const predicate = is(...args);
	return (tok) => (isArray(tok) ? allBy(tok, predicate) : predicate(tok));
}
export function isArrayOfStrings    (input) { return allBy(input, isString); }
export function isArrayOfNumbers    (input) { return allBy(input, isNumber); }
export function isArrayOfBooleans   (input) { return allBy(input, isBoolean); }
export function isArrayOfObjects    (input) { return allBy(input, isObject); }
export function isArrayOfMappables  (input) { return allBy(input, isMappable); }
export function isArrayOfPrimatives (input) { return allBy(input, isPrimitive); }
export function isArrayOfFunctions  (input) { return allBy(input, isFunction); }
export function isArrayOfRegEx      (input) { return allBy(input, isRegExp); }
export function isArrayOfTruthy     (input) { return allBy(input, isTruthy); }
export function isArrayOfFalsey     (input) { return allBy(input, isFalsey); }

export function contains (...args) {
	const predicate = is(...args);
	return (tok) => (isArray(tok) ? anyBy(tok, predicate) : predicate(tok));
}
export function containsStrings    (input) { return anyBy(input, isString); }
export function containsNumbers    (input) { return anyBy(input, isNumber); }
export function containsBooleans   (input) { return anyBy(input, isBoolean); }
export function containsObjects    (input) { return anyBy(input, isObject); }
export function containsMappables  (input) { return anyBy(input, isMappable); }
export function containsPrimatives (input) { return anyBy(input, isPrimitive); }
export function containsFunctions  (input) { return anyBy(input, isFunction); }
export function containsRegEx      (input) { return anyBy(input, isRegExp); }
export function containsTruthy     (input) { return anyBy(input, isTruthy); }
export function containsFalsey     (input) { return anyBy(input, isFalsey); }

export function truthy (value) {
	if (isMappable(value)) return !!sizeOf(value);
	return !!value;
}

export function falsey (value) {
	return !truthy(value);
}

export function hasOwn (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

export function lc (str) {
	return isString(str) ? str.toLowerCase() : str;
}

export function uc (str) {
	return isString(str) ? str.toUpperCase() : str;
}

export function ucfirst (input) {
	input = String(input);
	return input.charAt(0).toUpperCase() + input.slice(1);
}

export function ucsentence (input) {
	return input.replace(/((?:\S[^.?!]*)[.?!]*)/g, (txt) =>
		txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
	);
}

export function ucwords (input) {
	return input.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1));
}

export function merge (...sources) {
	const result = {};
	for (const source of sources) {
		if (!source) continue;
		for (const [ key, value ] of Object.entries(source)) {
			if (isObject(value)) {
				if (isObject(result[key])) {
					result[key] = merge(result[key], value);
				} else {
					result[key] = merge(value);
				}
			} else {
				result[key] = value;
			}
		}
	}
	return result;
}

export function get (obj, path, defaultValue) {
	if (isUndefinedOrNull(obj) || isPrimitive(obj)) throw new TypeError('Input object was not a collection.');
	if (isUndefinedOrNull(path) || path === '') return false;
	if (isNumber(path)) path = [ String(path) ];
	else if (isString(path)) {
		if (hasOwn(obj, path)) return obj[path];
		path = path.split(/[,[\].]+?/);
	}

	const result = path
		.filter((s) => isNotUndefinedOrNull(s) && s !== '')
		.reduce((res, key) =>
			((isNotUndefinedOrNull(res)) ? res[key] : res)
		, obj);
	return (isUndefined(result) || result === obj) ? defaultValue : result;
}

export function has (obj, path) {
	if (isUndefinedOrNull(path) || path === '') return false;
	if (isNumber(path)) path = [ String(path) ];
	else if (isString(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
	let res = obj;
	for (const key of path) {
		if (
			isUndefinedOrNull(res)
			|| (typeof res !== 'object' && isFunction(res))
			|| isUndefined(res[key])
		) return false;
		res = res[key];
	}
	return true;
}

export function set (obj, path, value) {
	if (isUndefinedOrNull(path) || path === '') return false;
	if (isNumber(path)) path = [ String(path) ];
	else if (isString(path)) {
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
			if (isObject(res[key]) || isFunction(res[key])) return res[key];
			return (res[key] = {});
		}, obj);

	return obj;
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
	if (isArray(collection) || isString(collection)) return collection.length;
	if (isSet(collection) || isMap(collection)) return collection.size;
	if (isObject(collection)) return Object.keys(collection).length;
	return !!collection;
}

export function keys (input) {
	if (isArray(input)) return [ ...input.keys() ];

	if (isSet(input)) return Array.from(input.entries(), ([ k ]) => k);

	if (isMap(input)) return Array.from(input.keys());

	if (isObject(input)) return Object.keys(input);

	return [];
}

export function values (input) {
	if (isArray(input)) return [ ...input ];

	if (isSet(input) || isMap(input)) return Array.from(input.values());

	if (isObject(input)) return Object.values(input);

	return [];
}

export function intersect (...arrays) {
	return arrays.reduce((a, b) => a.filter((c) => b.includes(c)));
}

export function difference (...arrays) {
	return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)));
}

export function arrayify (input) {
	if (isArray(input)) return input;

	if (isSet(input) || isMap(input)) return Array.from(input.values());

	if (isObject(input)) return Object.values(input);

	if (isString(input)) return input.split(/,\s*/);

	return [ input ];
}

export function first (input, count = 1) {
	if (count === 1) {
		if (isArray(input) || isString(input)) return input[0];
		if (isSet(input) || isObject(input)) for (const v of input) return v;
		if (isMap(input)) for (const [ , v ] of input) return v;
		return;
	}

	if (isArray(input) || isString(input)) return input.slice(0, count);
	if (isSet(input)) return Array.from(input).slice(0, count);
	if (isObject(input)) return Object.values(input).slice(0, count);
	if (isMap(input)) return Array.from(input.values()).slice(0, count);
}

export function last (input, count = 1) {
	if (count === 1) {
		if (isArray(input) || isString(input)) return input[input.length - 1];
	}

	if (isArray(input) || isString(input)) return input.slice(-count);
	if (isSet(input)) return Array.from(input).slice(-count);
	if (isObject(input)) return Object.values(input).slice(-count);
	if (isMap(input)) return Array.from(input.values()).slice(-count);
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

export function allBy (collection, predicate = null) {
	if (!collection) return false;
	if (predicate === null) {
		predicate = (v) => v;
	} else if (!isFunction(predicate)) {
		predicate = iteratee(predicate);
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (!predicate(value, i, i++)) return false;
		}
		return true;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (!predicate(item, i, i++)) return false;
		}
		return true;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (!predicate(value, key, i++)) return false;
		}
		return true;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (!predicate(value, key, i++)) return false;
		}
		return true;
	}

	return !!collection;
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

export function anyBy (collection, predicate = null) {
	if (!collection) return false;
	if (predicate === null) {
		predicate = (v) => v;
	} else if (!isFunction(iteratee)) {
		predicate = iteratee(predicate);
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (predicate(value, i, i++)) return true;
		}
		return false;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (predicate(item, i, i++)) return true;
		}
		return false;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (predicate(value, key, i++)) return true;
		}
		return false;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (predicate(value, key, i++)) return true;
		}
		return false;
	}

	return !!collection;
}

export function iteratee (match) {
	if (isUndefinedOrNull(match)) return (v) => v;

	if (isFunction(match)) return match;

	if (isString(match)) {
		return (o) => {
			if (isArray(o)) return o.includes(match);
			if (isObject(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			if (isPrimitive(o)) return o[match];
			return o === match;
		};
	}

	if (isNumber(match)) {
		return (o) => {
			if (isObject(o) || isArray(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			if (isNumber(o)) return o === match;
			if (isString(o)) return Number(o) === match;
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

export function sorter (match) {

	if (isFunction(match)) return match;

	function qs (a, b) {
		if (a > b) return 1;
		else if (b > a) return -1;
		return 0;
	}

	if (isString(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			return qs(a[match], b[match]);
		};
	}

	if (isArray(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			for (const k of match) {
				const v = qs(a[k], b[k]);
				if (v) return v;
			}
			return 0;
		};
	}

	if (isObject(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			for (const [ k, d ] of Object.entries(match)) {
				const v = qs(a[k], b[k]) * (d < 0 ? -1 : 1);
				if (v) return v;
			}
			return 0;
		};
	}

	return (a, b) => {
		if (!isObject(a) && !isObject(b)) return qs(a, b);
		if (!isObject(a)) return -1;
		if (!isObject(b)) return 1;
		return 0;
	};
}

export function toPairs (object) {
	return Object.entries(object);
}

export function fromPairs (entries) {
	return mapReduce(entries, ([ v, k ]) => [ v, k ]);
}

export function slice (collection, begin, end) {
	if (isString(collection) || isArray(collection)) return collection.slice(begin, end);

	if (isSet(collection)) {
		return new Set(Array.from(collection.values()).slice(begin, end));
	}

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries()).slice(begin, end));
	}

	if (isObject(collection)) {
		return fromPairs(toPairs(collection).slice(begin, end));
	}

	return collection;
}

export function sort (collection, predicate) {

	predicate = sorter(predicate);

	if (isArray(collection)) return [ ...collection ].sort(predicate);

	if (isSet(collection)) {
		return new Set(Array.from(collection.values()).sort(predicate));
	}

	// sort by key for maps and objects
	const hashpredicate = (a, b) => predicate(a[0], b[0]);

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries()).sort(hashpredicate));
	}

	if (isObject(collection)) {
		return fromPairs(toPairs(collection).sort(hashpredicate));
	}

	return collection;
}

export function map (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		return collection.map((value, i) => predicate(value, i, i));
	} else if (isSet(collection)) {
		return Array.from(collection, (value, i) => predicate(value, i, i));
	} else if (isMap(collection)) {
		return Array.from(collection.entries(), ([ key, value ], index) => predicate(value, key, index));
	} else if (isObject(collection)) {
		return Object.entries(collection).map(([ key, value ], index) => predicate(value, key, index));
	} else if (isString(collection)) {
		return collection.split().map((value, i) => predicate(value, i, i));
	}

	return [];
}

export function uniq (collection, predicate = null) {
	if (predicate === null) {
		predicate = (v) => v;
	} else {
		predicate = iteratee(predicate);
	}

	const exists = new Set();

	if (isArray(collection)) {
		const result = [];
		collection.forEach((v) => {
			const match = predicate(v);
			if (exists.has(match)) return;
			exists.add(match);
			result.push(v);
		});

		return result;
	}

	if (isSet(collection)) return new Set(collection); // really?

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries(), ([ k, v ]) => {
			const match = predicate(v);
			if (exists.has(match)) return false;
			exists.add(match);
			return [ k, v ];
		}).filter(Boolean));
	}

	if (isObject(collection)) {
		return mapReduce(collection, ([ v, k ]) => {
			const match = predicate(v);
			if (exists.has(match)) return null;
			exists.add(match);
			return [ k, v ];
		});
	}

	return collection;
}

export function keyBy (collection, predicate) {
	predicate = iteratee(predicate);
	return mapReduce(collection, (value, key, index) =>
		[ predicate(value, key, index), value ],
	);
}

export function groupBy (collection, predicate) {
	predicate = iteratee(predicate);
	return reduce(collection, (result, value, key, index) => {
		const k = predicate(value, key, index);
		(result[k] || (result[k] = [])).push(value);
		return result;
	}, {});
}

export function filter (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		return collection.filter((value, i) => predicate(value, i, i));
	}

	if (isSet(collection)) {
		return Array.from(collection).filter((value, i) => predicate(value, i, i));
	}

	throw new Error('filter can not be applied to objects or maps, perhaps you meant to use omit?');
}


export function find (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		for (const [ i, value ] of collection.entries()) {
			if (predicate(value, i, i)) return value;
		}
		return false;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const value of collection) {
			if (predicate(value, i, i++)) return value;
		}
		return false;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (predicate(value, key, i++)) return value;
		}
		return false;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (predicate(value, key, i++)) return value;
		}
		return false;
	}
}

export function findIndex (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		for (const [ i, value ] of collection.entries()) {
			if (predicate(value, i, i)) return i;
		}
		return false;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const value of collection) {
			if (predicate(value, i, i++)) return i;
		}
		return false;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (predicate(value, key, i++)) return key;
		}
		return false;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (predicate(value, key, i++)) return key;
		}
		return false;
	}
}

export function omit (collection, predicate) {
	if (isFunction(predicate)) {
		return mapReduce(collection, (value, key, index) =>
			(predicate(value, key, index)
				? [ undefined, undefined ]
				: [ key, value ]),
		);
	}

	if (isString(predicate)) {
		predicate = [ predicate ];
	}

	if (!isArray(predicate)) throw new Error('omit requires a string or array of strings');
	return mapReduce(collection, (value, key) =>
		(predicate.includes(key)
			? [ undefined, undefined ]
			: [ key, value ]),
	);
}

export function pick (collection, predicate) {
	if (!collection) return {};

	if (isFunction(predicate)) {
		return mapReduce(collection, (value, key, index) =>
			(predicate(value, key, index)
				? [ key, value ]
				: [ undefined, undefined ]),
		);
	}

	if (isString(predicate)) {
		predicate = [ predicate ];
	}

	if (!isArray(predicate)) throw new Error('pick requires a string or array of strings');
	return predicate.reduce((obj, key) => {
		const value = get(collection, key);
		if (isUndefined(value)) return obj;
		return set(obj, key, value);
	}, {});
}


export function deepPick (collection, schema) {
	if (isPrimitive(schema) && isPrimitive(collection)) return collection;

	if (isArray(schema) && schema.length > 0) {
		// collection does not match this schema tier, abort
		if (!isArray(collection)) return;

		schema = schema[0];
		return collection.map((branch) => deepPick(branch, schema));
	}

	// if the schema at this tier is not an object,
	// return the value at this tier only if schema is truthy
	if (!isObject(schema)) return schema ? collection : undefined;
	if (isPrimitive(collection)) return;

	// if the collection isn't something we can pull data from, skip it
	if (!isObject(collection) && !isFunction(collection)) return;

	const result = {};
	for (const [ key, subschema ] of Object.entries(schema)) {

		const target = collection[key];
		if (isUndefined(target)) continue;

		const child = deepPick(target, subschema);
		if (isUndefined(child)) continue;

		result[key] = child;
	}

	return result;
}



export function pathinate (object, delimiter = '.') {
	const paths = [];

	function descend (branch, ancest) {
		if (!isObject(branch)) {
			paths.push(ancest.join(delimiter));
			return;
		}
		for (const [ k, v ] of Object.entries(branch)) {
			descend(v, ancest.concat([ k ]));
		}
		return;
	}

	descend(object, []);

	return uniq(paths);
}

export function makeIterate (predicate, tuple = false) {
	predicate = iteratee(predicate);
	const result = {};
	function iterate (val, k, i) {
		// return true to continue looping
		const res = predicate(val, k, i) || [];
		if (tuple) {
			if (res === false) return false;
			if (!res || !isArray(res)) return true;
			const [ key, value ] = res;
			if (isUndefinedOrNull(key) || isUndefined(value)) return true;
			result[key] = value;
		} else {
			result[k] = res;
		}
		return true;
	}

	iterate.result = () => result;

	return iterate;
}

export function transcriber (datamap) {
	return function (source, predicate) {
		const result = {};
		datamap.forEach(([ from, to, trans ], index) => {
			if (source[from] === undefined) return;
			if (typeof to === 'function') {
				trans = to;
				to = from;
			} else if (to === undefined) to = from;

			const value = trans ? trans(source[from]) : source[from];

			result[to] = predicate ? predicate(value, { from, to }, index) : value;
		});
		return result;
	};
}

export function mapValues (collection, predicate) {
	if (!isObject(collection)) throw new Error('mapValues only works for simple objects, use mapReduce.');
	const iterate = makeIterate(predicate);

	let i = 0;
	for (const [ key, value ] of Object.entries(collection)) {
		if (!iterate(value, key, i++)) break;
	}
	return iterate.result();
}

/**
 * Iterates over a collection and generates an object based on tuple returned from the iteratee.
 * @param  {Object|Array|Map|Set} collection
 * @param  {Function} iteratee Callback invoked for each item, receives `value, key, index`, returns `[key, value]`;
 * @return {Object}
 */
export function mapReduce (collection, predicate) {
	if (!collection) return {};

	const iterate = makeIterate(predicate, true);

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (!iterate(value, i, i++)) break;
		}
	} else if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (!iterate(item, i, i++)) break;
		}
	} else if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (!iterate(value, key, i++)) break;
		}
	} else if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (!iterate(value, key, i++)) break;
		}
	}

	return iterate.result();
}

export function reduce (collection, predicate, init) {
	if (!isFunction(predicate)) throw new TypeError('Predicate must be a function');

	if (isArray(collection)) return collection.reduce((r, v, i) => predicate(r, v, i, i), init);

	if (isSet(collection)) {
		return Array.from(collection).reduce((r, v, i) => predicate(r, v, i, i), init);
	}

	if (isMap(collection)) {
		return Array.from(collection.entries()).reduce((prev, [ key, value ], i) => predicate(prev, value, key, i), init);
	}

	if (isObject(collection)) {
		return Object.entries(collection).reduce((prev, [ key, value ], i) => predicate(prev, value, key, i), init);
	}
}

export function flatten (collection, depth = Infinity) {
	if (depth <= 0) return slice(collection);
	return reduce(collection,
		(acc, val) => acc.concat(...(
			isMappable(val)
				? flatten(val, depth - 1)
				: [ val ]
		)),
		[],
	);
}

export function jsonSoftParse (input, fallback) {
	if (!isString(input)) return merge({}, input);
	try {
		return JSON.parse(input);
	} catch (e) {
		return fallback;
	}
}
