
import lexer from './lexer';
import { isString, wtf, isObject, set, makeContext, makeSafe, safeJoin } from './utils';
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
	if (isString(input)) return lexer(input);
	if ((input instanceof Block)) return input;
	wtf('Parse can only receive strings or a Handybars AST tree');
}

export function evaluate (input, scope) {
	if (isString(input)) input = lexer(input);
	else if (!(input instanceof Block)) {
		wtf('Evaluate can only receive strings or a Handybars AST tree');
	}

	return input.evaluate(scope, DefaultHelpers).value;
}

export {
	parse as partial,
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	makeContext,
	makeSafe,
	safeJoin,
};

export default function Handybars (template, world = {}) {
	const ast = parse(template);
	const env = { ...DefaultHelpers, ...world };

	function execute (scope) {
		return ast.evaluate(scope, env).value;
	}

	execute.set = (...args) => {
		if (isObject(args[0])) {
			Object.assign(env, ...args);
		} else {
			set(env, ...args);
		}
		return execute;
	};

	execute.setPartial = (name, subtemplate) => set(env, name, lexer(subtemplate));

	return execute;
}

Object.assign(Handybars, {
	parse,
	evaluate,
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	makeContext,
	makeSafe,
	safeJoin,
});
