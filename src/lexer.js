
import tokenizer from './tokenizer';
import { wtf, isUndefined, isString } from './utils';

import {
	BLOCK_OPEN,
	BLOCK_CLOSE,
	ELSE,
	INSERTION,
	RAW_TEXT,
	IDENTIFIER,
	LITERAL,
	ASSIGNMENT,
	BRACKET_OPEN,
	BRACKET_CONTINUE,
	BRACKET_APPEND,
	BRACKET_CLOSE,
	PAREN_OPEN,
	PAREN_CLOSE,

	isIdentifier,

	Text,
	Block,
	Invocation,
	Literal,
	Identifier,
	CompoundIdentifier,
	Collection,
} from './taxonomy';

export const tokenize = tokenizer()
	.rule(/{{else}}/, () => [
		ELSE,
	])
	.rule(/{{#(.+?)}}/, (match) => [
		BLOCK_OPEN,
		tokenizeArguments(match[1]),
	])
	.rule(/{{\/(.+?)}}/, (match) => [
		BLOCK_CLOSE,
		tokenizeArguments(match[1]),
	])
	.rule(/{{{([^#/]+)}}}/, (match) => [
		INSERTION,
		tokenizeArguments(match[1]),
		{ raw: true },
	])
	.rule(/{{([^#/]+)}}/, (match) => [
		INSERTION,
		tokenizeArguments(match[1]),
	])
	.rule(/[\w\W]+?(?={{)|[\w\W]+?$/, (match) => [
		RAW_TEXT,
		match[0],
	])
;

export const tokenizeArguments = tokenizer()
	.rule(/\s+/) // WHITE SPACE
	.rule(/]\[/,  () => [ BRACKET_CONTINUE ])
	.rule(/]\./,  () => [ BRACKET_APPEND ])
	.rule(/]/,  () => [ BRACKET_CLOSE ])
	.rule(/\[/, () => [ BRACKET_OPEN ])
	.rule(/\)/,  () => [ PAREN_CLOSE ])
	.rule(/\(/, () => [ PAREN_OPEN ])
	.rule(/(true|false|null)/i, (match) => [
		LITERAL,
		{
			'true': true,
			'false': false,
			'null': null,
		}[match[1].toLowerCase()],
	])
	.rule(/-?\d+(?:\.[\d]+)?/, (match) => [
		LITERAL,
		Number(match[0]),
	])
	.rule(/([a-zA-Z@][\w$_]*)=/,  (match) => [ ASSIGNMENT, match[1] ])
	.rule(/([a-zA-Z@][\w.$_]*)(\[?)/, (match) => {
		if (match[2]) return [ IDENTIFIER, match[1], { BRACKET_OPEN } ];
		return [ IDENTIFIER, match[1] ];
	})
	.rule(/"((?:[^"\\]|\\.)*?)"/, (match) => [
		LITERAL,
		match[1],
	])
	.rule(/'((?:[^'\\]|\\.)*?)'/, (match) => [
		LITERAL,
		match[1],
	])
;

export default function lex (input) {
	const tokens = tokenize(input);

	function descend (invocationArguments) {
		if (!isIdentifier(invocationArguments[0])) wtf('Block helpers must start with a variable identifier.');

		const type = invocationArguments[0][1];
		const block = new Block({
			type,
			invoker: type === 'ROOT' ? null : lexArguments(invocationArguments),
			left: [],
		});

		let children = block.left;

		let tok;
		while ((tok = tokens.shift())) {
			const [ tokType, tokValue, tokOptions ] = tok;

			if (tokType === RAW_TEXT) {
				children.push(new Text({ value: tokValue }));
				continue;
			}

			if (tokType === BLOCK_CLOSE) {
				const [ closeTarget ] = tokValue;
				if (!isIdentifier(closeTarget)) wtf('Invalid block type: ' + closeTarget[1]);
				if (closeTarget[1] !== block.type) wtf('Mismatching block closure: ' + closeTarget[1]);
				return block;
			}

			if (tokType === BLOCK_OPEN) {
				const [ openTarget ] = tokValue;
				if (!isIdentifier(openTarget)) wtf('Invalid block type: ' + openTarget[1]);
				children.push(descend(tokValue));
				if (tokOptions) Object.assign(children[ children.length - 1], tokOptions);
				continue;
			}

			if (tokType === INSERTION) {
				const [ openTarget ] = tokValue;
				children.push(new Block({
					type: openTarget[1],
					invoker: lexArguments(tokValue),
					...tokOptions,
				}));
			}

			if (tokType === ELSE) {
				children = block.right = [];
				continue;
			}
		}

		if (block.type !== 'ROOT') wtf('Unexpected end of template, unclosed block: ' + block.type);
		return block;
	}

	return descend([ [ 'IDENTIFIER', 'ROOT' ] ]);
}

export function lexArguments (input) {
	const tokens = [ ...input ];

	function peek (type, delta) {
		if (isUndefined(type) || (isString(type) && isUndefined(delta))) delta = 1;
		const tok = tokens[Math.max(0, delta - 1)];
		if (type && tok[0] !== type) return null;
		return tok;
	}

	function read (type) {
		const tok = tokens[0];
		if (type && tok[0] !== type) return null;
		return tokens.shift();
	}

	function descendCompoundIdent (initial) {
		const ident = new CompoundIdentifier(initial);

		let tok;
		let appending = false;
		while ((tok = read())) {
			const [ tokType, tokValue, tokOptions ] = tok;

			if (tokType === BRACKET_APPEND) {
				appending = true;
				continue;
			}

			if (tokType === BRACKET_CONTINUE) {
				continue;
			}

			if (tokType === BRACKET_CLOSE) {
				return ident;
			}

			if (tokType === IDENTIFIER) {
				const opening = tokOptions && tokOptions[BRACKET_OPEN];
				if (appending) {
					appending = false;
					if (opening) {
						ident.pushRef(new Identifier(tokValue));
					} else {
						ident.pushTarget(new Identifier(tokValue));
					}
				} else if (opening) {
					ident.pushRef(descendCompoundIdent(tokValue));
				} else {
					ident.pushRef(new Identifier(tokValue));
				}

				if (peek(IDENTIFIER) || peek(LITERAL)) {
					wtf('Unexpected double identifier/literal inside compound identifier');
				}
				continue;
			}

			if (tokType === LITERAL) {
				if (appending) {
					wtf('Unexpected literal found appended to a compound identifier.');
				}

				ident.pushTarget(new Literal(tokValue));
				continue;
			}

			if (tokType === PAREN_OPEN) {
				ident.pushRef(descendInvocation(true));
				continue;
			}

			wtf('Unexpected token: ' + tokType);
		}

		wtf('Unexpected end of token stream, unclosed compound identifier');
	}

	function descendInvocation (embedded = false) {
		const invocation = new Invocation();
		const children = invocation.arguments;

		let tok;
		let assigning = false;
		while ((tok = read())) {
			const [ tokType, tokValue, tokOptions ] = tok;

			if (children.length && tokType !== PAREN_CLOSE) children[0].critical = true;

			if (tokType === IDENTIFIER) {
				if (tokOptions && tokOptions[BRACKET_OPEN]) {
					if (assigning) {
						invocation.set(assigning, descendCompoundIdent(tokValue));
						assigning = false;
					} else {
						children.push(descendCompoundIdent(tokValue));
					}
				} else if (assigning) {
					invocation.set(assigning, new Identifier(tokValue));
					assigning = false;
				} else {
					children.push(new Identifier(tokValue));
				}

				continue;
			}

			if (!children.length) wtf('Block helpers must start with a variable identifier.');

			if (tokType === PAREN_OPEN) {
				if (assigning) {
					invocation.set(assigning, descendInvocation(true));
					assigning = false;
				} else {
					children.push(descendInvocation(true));
				}
				continue;
			}

			if (tokType === LITERAL) {
				if (assigning) {
					invocation.set(assigning, new Literal(tokValue));
					assigning = false;
				} else {
					children.push(new Literal(tokValue));
				}
				continue;
			}

			if (tokType === BRACKET_OPEN) {
				if (assigning) {
					invocation.set(assigning, descendCollection());
					assigning = false;
				} else {
					children.push(descendCollection());
				}
				continue;
			}

			if (assigning) wtf('Unexpected token: ' + tokType);

			if (tokType === PAREN_CLOSE) {
				if (!embedded) wtf('Unexpected token: ' + tokType);
				return invocation;
			}

			if (tokType === ASSIGNMENT) {
				assigning = tokValue;
				continue;
			}

			wtf('Unexpected token: ' + tokType);
		}

		if (embedded) wtf('Unexpected end of token stream, unclosed nested invocation.');
		return invocation;
	}

	function descendCollection () {
		const collection = new Collection();
		const children = collection.arguments;

		let tok;
		while ((tok = read())) {
			const [ tokType, tokValue, tokOptions ] = tok;

			if (tokType === BRACKET_CLOSE) {
				return collection;
			}

			if (tokType === PAREN_OPEN) {
				children.push(descendInvocation(true));
				continue;
			}

			if (tokType === IDENTIFIER) {
				if (tokOptions[BRACKET_OPEN]) {
					children.push(descendCompoundIdent(tok));
				} else {
					children.push(new Identifier(tokValue));
				}
				continue;
			}

			if (tokType === LITERAL) {
				children.push(new Literal(tokValue));
				continue;
			}

			if (tokType === BRACKET_OPEN) {
				children.push(descendCollection());
				continue;
			}

			wtf('Unexpected token: ' + tokType);
		}

	}

	return descendInvocation();
}
