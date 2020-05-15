
import tokenize, {
	T,
	T_WHITESPACE,
	T_TEXT,
	T_BLOCK_START,
	T_BLOCK_STOP,
	T_BLOCK_OPEN,
	T_BLOCK_CLOSE,
	T_ELSE,
	T_IDENTIFIER,
	T_LITERAL_NUM,
	T_LITERAL_STR,
	T_LITERAL_PRI,
	T_BRACKET_OPEN,
	T_BRACKET_CLOSE,
	T_PAREN_OPEN,
	T_PAREN_CLOSE,
	T_ASSIGNMENT,
} from '../src/tokenizer';

import { isUndefined, isString } from './utils';

import {
	Text,
	Block,
	Invocation,
	Literal,
	Identifier,
	CompoundIdentifier,
	Collection,
} from './taxonomy';

export default function lex (input, debug) {
	const tokens = tokenize(input);
	let tok, contents;
	let tindex = 0;

	if (debug) console.dir(tokens.map(({ type, ...rest }) => ({ type: T[type], ...rest }))); // eslint-disable-line no-console
	function next (type, required) {
		if (!tokens.length) return;
		const t = tokens[0];
		if (!isUndefined(type) && t && t.type !== type) {
			if (required) wtf(isString(required) ? required : `Expected ${type} but found ${T[t.type]}`, t);
			return;
		}
		contents = t.contents;
		tindex++;
		return (tok = tokens.shift());
	}

	function peek (type, delta = 0) {
		const t = tokens[Math.max(0, delta)];
		if (!isUndefined(type) && t && t.type !== type) return;
		return t;
	}


	const err = new SyntaxError();
	function wtf (msg = 'Unexpected token: ' + T[tok.type], { line, column, ...extra } = tok || {}) {
		msg += (line ? ` (${line}:${column})` : '');
		if (debug) msg += `[Token ${tindex}]`;
		let e = err;
		if (debug) e = new SyntaxError(msg);
		else err.message = msg;
		throw Object.assign(e, extra);
	}

	const is = (type) => (t = tok) => t && t.type === type;
	const isIdentifier   = is(T_IDENTIFIER);
	const isText         = is(T_TEXT);
	const isWhitespace   = is(T_WHITESPACE);
	const isBlockStart   = is(T_BLOCK_START);
	const isBlockStop    = is(T_BLOCK_STOP);
	const isBracketOpen  = is(T_BRACKET_OPEN);
	const isBracketClose = is(T_BRACKET_CLOSE);
	const isParenOpen    = is(T_PAREN_OPEN);
	const isParenClose   = is(T_PAREN_CLOSE);
	const isAssignment   = is(T_ASSIGNMENT);
	const isLiteralNum   = is(T_LITERAL_NUM);
	const isLiteralStr   = is(T_LITERAL_STR);
	const isLiteralPri   = is(T_LITERAL_PRI);
	const isLiteral = (t = tok) => isLiteralNum(t) || isLiteralStr(t) || isLiteralPri(t);

	function descendBlock (raw) {
		let isRoot = false;
		if (!tok) {
			isRoot = true;
		} else if (!isIdentifier()) wtf(`Block helpers must start with a variable identifier, found "${tok.contents}" (${T[tok.type]})`);

		const block = new Block({
			type: isRoot ? 'ROOT' : contents,
			invoker: isRoot ? null : descendInvocation(),
			left: [],
		});
		if (raw) block.raw = raw;

		let children = block.left;

		while (next()) {
			if (isText()) {
				children.push(new Text(contents));
				continue;
			}

			if (isBlockStart()) {
				const r = tok.raw;
				if (next(T_BLOCK_OPEN)) {
					next();
					children.push(descendBlock(r));
				} else if (next(T_ELSE)) {
					if (!children.length) children.push(new Text());
					children = block.right = [];
					while (next(T_WHITESPACE)); // allow whitespace in the end of closing tags
					next(T_BLOCK_STOP, `Expected }}, found "${tok.contents}" (${T[tok.type]})`);
				} else if (next(T_BLOCK_CLOSE)) {
					next(T_IDENTIFIER, `The first argument of a block must be an identifier, found "${tok.contents}" (${T[tok.type]})`);
					if (contents !== block.type) wtf(`Expected {{/${block.type}}} but found {{/${contents}}}`);
					if (!children.length) children.push(new Text());
					while (next(T_WHITESPACE)); // allow whitespace in the end of closing tags
					next(T_BLOCK_STOP, `Expected }}, found "${tok.contents}" (${T[tok.type]})`);
					return block;
				} else if (next(T_IDENTIFIER)) {
					children.push(new Block({
						type: contents,
						invoker: descendInvocation(),
						raw: r,
					}));
				} else wtf(`This shouldn't have happened. "${peek().contents}" (${T[peek().type]})`);
				continue;
			}

			wtf(`Unexpected token while processing block children for {{#${block.type}}}: "${tok.contents}" (${T[tok.type]})`);
		}

		if (!isRoot) wtf(`Unexpected end of template, unclosed {{#${block.type}}}`);
		return block;
	}

	function descendInvocation (embedded = false) {
		const invocation = new Invocation();
		const children = invocation.arguments;

		let assigning = false;
		do {
			if (children.length && embedded) children[0].critical = true;

			if (isWhitespace()) continue;

			if (isIdentifier()) {
				if (peek(T_BRACKET_OPEN)) {
					if (assigning) {
						invocation.set(assigning, descendCompoundIdent(contents));
						assigning = false;
					} else {
						children.push(descendCompoundIdent(contents));
					}
				} else if (assigning) {
					invocation.set(assigning, new Identifier(contents));
					assigning = false;
				} else {
					children.push(new Identifier(contents));
				}
				continue;
			}

			if (isBlockStop()) {
				if (children.length > 1) children[0].critical = true;
				return invocation;
			}

			if (!children.length) wtf(`Block helpers must start with a variable identifier, found "${tok.contents}" (${T[tok.type]})`);

			if (isParenOpen()) {
				next();
				if (assigning) {
					invocation.set(assigning, descendInvocation(true));
					assigning = false;
				} else {
					children.push(descendInvocation(true));
				}
				continue;
			}

			if (isLiteral()) {
				if (assigning) {
					invocation.set(assigning, new Literal(contents, tok.type));
					assigning = false;
				} else {
					children.push(new Literal(contents, tok.type));
				}
				continue;
			}

			if (isBracketOpen()) {
				if (assigning) {
					invocation.set(assigning, descendCollection());
					assigning = false;
				} else {
					children.push(descendCollection());
				}
				continue;
			}

			if (assigning) wtf();

			if (isParenClose()) {
				if (!embedded) wtf();
				return invocation;
			}

			if (isAssignment()) {
				const last = children.pop();
				assigning = last.target;
				continue;
			}

			wtf();
		} while (next());

		if (embedded) wtf('Unexpected end of token stream, unclosed nested invocation.');
		return invocation;
	}

	function descendCompoundIdent (initial) {
		const ident = new CompoundIdentifier(initial);

		let ref = false;
		while (next()) {

			if (isWhitespace()) {
				break;
			}

			if (isBracketClose()) {
				const nt = peek();
				// ]. or ][ is a continuation of the cIdent
				if (isBracketOpen(nt) || isIdentifier(nt)) {
					continue;
				}
				break;
			}

			if (isIdentifier()) {
				if (next(T_BRACKET_OPEN)) {
					ident.pushRef(descendCompoundIdent(contents));
				} if (ref) {
					ref = false;
					ident.pushRef(new Identifier(contents));
				} else {
					ident.pushTarget(new Identifier(contents));
				}

				const nt = peek();
				if (isBracketOpen(nt) || isBracketClose(nt)) {
					continue;
				}
				break;
			}

			if (isParenOpen()) {
				ident.pushRef(descendInvocation(true));
				continue;
			}

			if (isLiteral()) {
				ident.pushTarget(new Literal(contents, tok.type));
				continue;
			}

			if (isBracketOpen()) {
				ref = true;
				continue;
			}

			break;
		}

		return ident;
	}

	function descendCollection () {
		const collection = new Collection();
		const children = collection.arguments;

		while (next()) {

			if (isWhitespace()) continue;

			if (isBracketClose()) {
				return collection;
			}

			if (isParenOpen()) {
				children.push(descendInvocation(true));
				continue;
			}

			if (isIdentifier()) {
				if (next(T_BRACKET_OPEN)) {
					children.push(descendCompoundIdent(contents));
				} else {
					children.push(new Identifier(contents));
				}
				continue;
			}

			if (isLiteral()) {
				children.push(new Literal(contents, tok.type));
				continue;
			}

			if (isBracketOpen()) {
				children.push(descendCollection());
				continue;
			}

			wtf();
		}

		wtf('Unexpected end of token stream, unclosed collection.');
	}

	const result = descendBlock();
	if (tokens.length) wtf('There are still tokens left, how did we get here?');
	return result;
}
