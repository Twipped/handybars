
import { get, wtf, isPrimitive, isFunction, isUndefinedOrNull, safe, mapValues, makeContext, MISSING } from './utils';

import {
	T_LITERAL_NUM,
	T_LITERAL_PRI,
} from './tokenizer';

export class Node {
	evaluate () { return null; }
}

export class Text extends Node {
	constructor (value = '') {
		super();
		this.value = value;
	}

	evaluate () {
		return { value: this.value };
	}
}

export class Block extends Node {
	constructor ({ type, invoker, left, right, raw, ...props }) {
		super();
		Object.assign(this, props);
		this.type = type;
		this.invoker = invoker || null;
		this.left = left || null;
		this.right = right || null;
		this.raw = raw || false;
	}

	_descender (tree, scope, env) {
		if (!tree || !tree.length) return null;
		return (subscope = scope, e = env) => {
			if (e === env && subscope !== scope) e = makeContext(subscope, e);
			return render(tree, subscope, e);
		};
	}

	evaluate (scope, env = {}) {
		const fn = this._descender(this.left, scope, env);
		const inverse = this._descender(this.right, scope, env);
		const children = this.left && this.left.length ? this.left : null;

		var result = this.invoker
			? this.invoker.evaluate(scope, env, { fn, inverse, children })
			: fn && fn(scope) || undefined
		;

		return this.raw ? safe(result) : safe.up(result);
	}
}

export class Invocation extends Node {
	constructor (props = {}) {
		super();
		Object.assign(this, props);
		this.arguments = props.arguments || [];
		this.hash = props.hash || {};
	}

	evaluate (scope, env = {}, { fn, inverse, children } = {}) {
		if (!this.arguments.length) return ''; // this shouldn't happen
		let [ target, ...args ] = this.arguments;
		target = target.evaluate(scope, env);

		const hash = this.hashCount ? mapValues(this.hash, (a) => safe.down(a.evaluate(scope, env))) : {};

		if (target && isFunction(target.evaluate)) {
			const source = args.length ? args[0] : scope;
			const frame = makeContext(source, env, { hash });
			if (children) frame['@partial-block'] = new Block({ type: '@partial-block', left: children });
			return target.evaluate(source, frame);
		}

		if (!isFunction(target)) {
			if (target && fn) return fn(scope, env);
			if (!target && inverse) return inverse(scope, env);
			if (fn && inverse) return target ? fn(scope, env) : inverse(scope, env);
			return target;
		}

		args = args.map((a) => safe.down(a.evaluate(scope, env)));
		return target(...args, {
			scope,
			env,
			fn,
			inverse,
			arguments: args,
			hash,
			resolve: (what) => resolve(what, scope, env),
		});
	}

	set (key, value) {
		this.hash[key] = value;
		this.hashCount = (this.hashCount || 0) + 1;
		return this;
	}
}

export class Collection extends Invocation {
	constructor (args) {
		super();
		this.arguments = args || [];
	}

	evaluate (scope, env = {}) {
		return this.arguments.map((a) => a.evaluate(scope, env));
	}
}

export class Identifier extends Node {
	constructor (target, critical) {
		super();
		this.target = target;
		this.critical = !!critical;
	}

	evaluate (scope, env = {}) {
		return resolve(this.target, scope, env, this.critical);
	}
}

export class CompoundIdentifier extends Node {
	constructor (target, args = [], critical = false) {
		super();
		this.path = target.split(/[,[\].]+?/).filter(Boolean).map((i) => new Identifier(i));
		this.refs = [];
		this.critical = critical;

		for (const arg of args) {
			if (arg.r) this.pushRef(arg.r);
			else this.pushTarget(arg);
		}
	}

	evaluate (scope, env = {}) {
		const refs = this.refs.map((spec) => safe.down(spec.evaluate(scope, env, this.critical)));
		const path = this.path.map((spec) => {
			if (spec.ref !== undefined) return refs[spec.ref];
			if (spec.evaluate) {
				return safe.down(spec.evaluate(scope, env, this.critical));
			}
			return null;
		});

		const target = path.shift();
		if (!target) return;

		const result = get(target, path, MISSING);
		return result === MISSING ? undefined : result;
	}

	pushRef (spec) {
		this.refs.push(spec);
		this.path.push({ ref: this.refs.length - 1 });
	}

	pushTarget (spec) {
		this.path.push(spec);
	}
}

export class Literal extends Node {
	constructor (value, type = T_LITERAL_PRI) {
		super();
		this.value = value;
		this.type = type;
	}

	evaluate () {
		if (this.type === T_LITERAL_NUM) return parseFloat(this.value);
		return this.value;
	}
}

function render (children, scope, env) {
	if (!Array.isArray(children) || !children.length) return '';
	const value = children
		.map((c) => safe.up(c.evaluate(scope, env)))
		.filter((c) => c.value !== '')
		.map((c) => c.value)
		.join('');
	return { value };
}


function resolve (what, scope, env, needed = false) {
	let target;
	if (!isUndefinedOrNull(scope)  && !isPrimitive(scope) && (target = get(scope, what, MISSING)) !== MISSING) return target;
	if (!isUndefinedOrNull(env)    && (target = get(env, what, MISSING)) !== MISSING) return target;

	let parent = env;
	while ((parent = parent['@parent'])) {
		if (!isUndefinedOrNull(parent.this) && !isPrimitive(parent.this) && (target = get(parent.this, what, MISSING)) !== MISSING) return target;
		if (!isUndefinedOrNull(parent)      && (target = get(parent, what, MISSING)) !== MISSING) return target;
	}

	if (needed) wtf(`Could not resolve "${what}"`);
	return;
}

export default {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
};

