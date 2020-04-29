
import { is, get, wtf, isFunctionType, makeSafe, deSafe, mapValues } from './utils';

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

export const isBlockOpen  = is(BLOCK_OPEN);
export const isBlockClose = is(BLOCK_CLOSE);
export const isElse       = is(ELSE);
export const isInsertion  = is(INSERTION);
export const isRawText    = is(RAW_TEXT);
export const isIdentifier = is(IDENTIFIER);
export const isLiteral    = is(LITERAL);
export const isAssignment = is(ASSIGNMENT);
export const isBracketOpen   = is(BRACKET_OPEN);
export const isBracketClose  = is(BRACKET_CLOSE);
export const isParenOpen   = is(PAREN_OPEN);
export const isParenClose  = is(PAREN_CLOSE);

const MISSING = '{!MISSING!}';

class Node {}

export class Text extends Node {
	constructor ({ value }) {
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
			(subscope) => render(this.left, subscope, env)
		);

		const inverse = this.right && this.right.length && (
			(subscope) => render(this.right, subscope, env)
		);

		if (!this.invoker) return makeSafe(fn && fn(scope) || undefined);

		return makeSafe(this.invoker.evaluate(scope, env, { fn, inverse }));
	}
}

export class Invocation extends Node {
	constructor (props = {}) {
		super();
		Object.assign(this, props);
		this.arguments = props.arguments || [];
		this.hash = props.hash || {};
	}

	evaluate (scope, env = {}, { fn, inverse }) {
		let { target, ...args } = this.arguments;
		target = target.evaluate(scope, env);

		if (!isFunctionType(target)) {
			if (target && fn) return fn(scope);
			if (!target && inverse) return inverse();
			if (fn && inverse) return target ? fn(scope) : inverse(scope);
			return target;
		}

		args = args.map((a) => deSafe(a.evaluate(scope, env)));
		const hash = mapValues(this.hash, (a) => deSafe(a.evaluate(scope, env)));

		return target(...args, {
			data: scope,
			fn,
			inverse,
			hash,
		});
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
		const refs = this.refs.map((spec) => deSafe(spec.evaluate(scope, env)));
		const path = this.path.map((spec) => {
			if (spec.ref) return refs[spec.ref];
			if (spec.evaluate) {
				return deSafe(spec.evaluate(scope, env));
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
		return makeSafe(this.value);
	}
}

function render (children, scope, env) {
	if (!Array.isArray(children) || !children.length) return '';
	const value = children
		.map((c) => makeSafe(c.evaluate(scope, env)))
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
		(target = get(scope, what, MISSING)) === MISSING &&
		(target = get(env, what, MISSING)) === MISSING
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

