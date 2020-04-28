
import tokenizer from './tokenizer';
import { wtf } from './utils';

import {
	BLOCK_OPEN,
	BLOCK_CLOSE,
	ELSE,
	INSERTION,
	RAW_TEXT,
	IDENTIFIER,
	LITERAL,
	EMBED,

	isBlockOpen,
	isBlockClose,
	isElse,
	isInsertion,
	isRawText,
	isIdentifier,

	Text,
	Block,
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
	.rule(/\s+/)
	.rule(/(true|false|null)/i, (match) => [
		LITERAL,
		{
			'true': true,
			'false': false,
			'null': null,
		}[match[1].toLowerCase()],
	])
	.rule(/\d+/, (match) => [
		LITERAL,
		match[0],
	])
	.rule(/[\w.$_[\]]+/, (match) => [
		IDENTIFIER,
		match[0],
	])
	.rule(/"((?:[^"\\]|\\.)*?)"/, (match) => [
		LITERAL,
		match[1],
	])
	.rule(/'((?:[^'\\]|\\.)*?)'/, (match) => [
		LITERAL,
		match[1],
	])
	.rule(/\((.+?)\)/, (match) => [
		EMBED,
		tokenizeArguments(match[1]),
	]);

export default function lex (input) {
	const tokens = tokenize(input);

	function descend (openTarget, ...args) {
		const block = new Block({
			target: openTarget[1],
			arguments: args,
			children: [],
		});

		let children = block.children;

		let tok;
		while ((tok = tokens.shift())) {
			const opts = tok[2];
			const value = tok[1];
			if (isRawText(tok)) {
				children.push(new Text({ value }));
				continue;
			}

			if (isBlockClose(tok)) {
				const [ closeTarget ] = value;
				if (!isIdentifier(closeTarget)) wtf('Invalid block type: ' + closeTarget[1]);
				if (closeTarget[1] !== openTarget[1]) wtf('Mismatching block closure: ' + closeTarget[1]);
				return block;
			}

			if (isBlockOpen(tok)) {
				if (!isIdentifier(value[0])) wtf('Invalid block type: ' + value[0][1]);
				children.push(descend(...value));
				if (opts) Object.assign(children[ children.length - 1], opts);
				continue;
			}

			if (isInsertion(tok)) {
				const [ target, ...targs ] = value;
				children.push(new Block({
					target: target[1],
					arguments: targs,
					...opts,
				}));
			}

			if (isElse(tok)) {
				children = block.alternates = [];
				continue;
			}
		}

		if (openTarget[0] !== 'ROOT') wtf('Unexpected end of template, unclosed block: ' + openTarget[1]);
		return block;
	}

	return descend([ 'ROOT' ]);
}
