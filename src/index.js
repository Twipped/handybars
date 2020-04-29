
import lexer from './lexer';
import { isStringType, wtf, isObject, set, makeFrame, makeSafe } from './utils';
import {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
} from './taxonomy';
import DefaultHelpers from './helpers';

export function parse (input) {
	if (isStringType(input)) return lexer(input);
	if ((input instanceof Block)) return input;
	wtf('Parse can only receive strings or a Handybars AST tree');
}

export function evaluate (input, scope) {
	if (isStringType(input)) input = lexer(input);
	else if (!(input instanceof Block)) {
		wtf('Evaluate can only receive strings or a Handybars AST tree');
	}

	return input.evaluate(scope, DefaultHelpers).value;
}

export {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	makeFrame,
	makeSafe,
};

export default function Handybars (template, env = {}) {
	const ast = parse(template);
	const world = { ...DefaultHelpers, ...env };

	function execute (scope) {
		return ast.evaluate(scope, world).value;
	}

	execute.set = (...args) => {
		if (isObject(args[0])) {
			Object.assign(world, ...args);
		} else {
			set(world, ...args);
		}
		return execute;
	};

	return execute;
}

Object.assign(Handybars, {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
});
