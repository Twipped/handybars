
import { is, get, wtf, isFunctionType, makeSafe } from './utils';

export const BLOCK_OPEN  = 'BLOCK_OPEN';
export const BLOCK_CLOSE = 'BLOCK_CLOSE';
export const ELSE        = 'ELSE';
export const INSERTION   = 'INSERTION';
export const RAW_TEXT    = 'RAW_TEXT';
export const IDENTIFIER  = 'IDENTIFIER';
export const LITERAL     = 'LITERAL';
export const EMBED       = 'EMBED';

export const isBlockOpen  = is(BLOCK_OPEN);
export const isBlockClose = is(BLOCK_CLOSE);
export const isElse       = is(ELSE);
export const isInsertion  = is(INSERTION);
export const isRawText    = is(RAW_TEXT);
export const isIdentifier = is(IDENTIFIER);
export const isLiteral    = is(LITERAL);
export const isEmbed      = is(EMBED);

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
	constructor ({ target, arguments: args, ...props }) {
		super();
		Object.assign(this, props);
		this.target = target || null;
		this.arguments = args || [];
	}

	_evaluate (scope, world = {}) {
		const target = this.target
			? resolve(this.target, scope, world, true)
			: true
		;

		const fn = this.children && this.children.length && (
			(subscope) => render(this.children, subscope, world)
		);
		const inverse = this.alternates && this.alternates.length && (
			(subscope) => render(this.alternates, subscope, world)
		);

		// if it resolved a data value, render based on if that value is truthy
		if (!isFunctionType(target)) {
			if (target && fn) return fn(scope);
			if (!target && inverse) return inverse();
			if (fn && inverse) return target ? fn(scope) : inverse(scope);
			return target;
		}

		// otherwise, we have a function, so we need to call it and return the result

		const args = this.arguments.map((a) => resolve(a, scope, world));

		return target(...args, {
			data: scope,
			fn,
			inverse,
		});
	}

	evaluate (...args) {
		return makeSafe(this._evaluate(...args));
	}
}



function render (children, scope, world) {
	if (!Array.isArray(children) || !children.length) return '';
	const value = children
		.map((c) => makeSafe(c.evaluate(scope, world)))
		.filter((c) => c.value !== '')
		.map((c) => c.value)
		.join('');
	return { value };
}


function resolve (what, scope, world, needed = false) {
	if (isLiteral(what)) return what[1];
	if (isIdentifier(what)) what = what[1];

	let target;
	if (
		(target = get(scope, what, MISSING)) === MISSING &&
		(target = get(world, what, MISSING)) === MISSING
	) {
		if (needed) wtf(`Could not resolve "${what}"`);
		return;
	}

	return target;
}

export default {
	Text,
	Block,
};

