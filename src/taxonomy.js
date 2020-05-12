
import { tis, get, wtf, isFunction, isUndefinedOrNull, safe, mapValues, makeContext, MISSING } from './utils';

export const BLOCK_OPEN  = 'BLOCK_OPEN';
export const BLOCK_CLOSE = 'BLOCK_CLOSE';
export const ELSE        = 'ELSE';
export const INSERTION   = 'INSERTION';
export const RAW_TEXT    = 'RAW_TEXT';
export const IDENTIFIER  = 'IDENTIFIER';
export const LITERAL     = 'LITERAL';
export const ASSIGNMENT  = 'ASSIGNMENT';
export const BRACKET_OPEN     = 'BRACKET_OPEN';
export const BRACKET_CONTINUE = 'BRACKET_CONTINUE';
export const BRACKET_APPEND   = 'BRACKET_APPEND';
export const BRACKET_CLOSE    = 'BRACKET_CLOSE';
export const PAREN_OPEN  = 'PAREN_OPEN';
export const PAREN_CLOSE = 'PAREN_CLOSE';

export const isBlockOpen     = tis(BLOCK_OPEN);
export const isBlockClose    = tis(BLOCK_CLOSE);
export const isElse          = tis(ELSE);
export const isInsertion     = tis(INSERTION);
export const isRawText       = tis(RAW_TEXT);
export const isIdentifier    = tis(IDENTIFIER);
export const isLiteral       = tis(LITERAL);
export const isAssignment    = tis(ASSIGNMENT);
export const isBracketOpen   = tis(BRACKET_OPEN);
export const isBracketClose  = tis(BRACKET_CLOSE);
export const isParenOpen     = tis(PAREN_OPEN);
export const isParenClose    = tis(PAREN_CLOSE);

export class Node {
	evaluate () { return null; }
}

export class Text extends Node {
	constructor ({ value = '' } = {}) {
		super();
		this.value = value;
	}

	evaluate () {
		return { value: this.value };
	}
}

export class Block extends Node {
	constructor ({ type, invoker, ...props }) {
		super();
		Object.assign(this, props);
		this.type = type;
		this.invoker = invoker || null;
		this.left = props.left || null;
		this.right = props.right || null;
	}

	evaluate (scope, env = {}) {
		const fn = this.left && this.left.length && (
			(subscope = scope, e = env) => render(this.left, subscope, subscope === scope ? e : makeContext(subscope, e))
		);

		const inverse = this.right && this.right.length && (
			(subscope = scope, e = env) => render(this.right, subscope, subscope === scope ? e : makeContext(subscope, e))
		);

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

	evaluate (scope, env = {}, { fn, inverse, children }) {
		if (!this.arguments.length) return ''; // this shouldn't happen
		let [ target, ...args ] = this.arguments;
		target = target.evaluate(scope, env);

		const hash = this.hashCount ? mapValues(this.hash, (a) => safe.down(a.evaluate(scope, env))) : {};

		if (target instanceof Node) {
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
	constructor (target, critical) {
		super();
		this.path = target.split(/[,[\].]+?/).filter(Boolean).map((i) => new Identifier(i));
		this.refs = [];
		this.critical = critical;
	}

	evaluate (scope, env = {}) {
		const refs = this.refs.map((spec) => safe.down(spec.evaluate(scope, env)));
		const path = this.path.map((spec) => {
			if (spec.ref) return refs[spec.ref];
			if (spec.evaluate) {
				return safe.down(spec.evaluate(scope, env));
			}
			return null;
		});
		return resolve(path, scope, env, this.critical);
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
	constructor (value) {
		super();
		this.value = value;
	}

	evaluate () {
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
	if (isLiteral(what)) return what[1];
	if (isIdentifier(what)) what = what[1];

	let target;
	if (
		(isUndefinedOrNull(scope) || (target = get(scope, what, MISSING)) === MISSING) &&
		(isUndefinedOrNull(env) || (target = get(env, what, MISSING)) === MISSING)
	) {
		if (needed) wtf(`Could not resolve "${what}"`);
		return;
	}

	return target;
}

export default {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
};

