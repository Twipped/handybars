
import lexer from './lexer';
import { isStringType, wtf, set } from './utils';
import { Text, Block } from './taxonomy';
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
};

export default function Handybars (template, env = {}) {
	const ast = parse(template);
	const world = { ...DefaultHelpers, ...env };

	function execute (scope) {
		return ast.evaluate(scope, world).value;
	}

	execute.set = (...args) => set(world, ...args);

	return execute;
}

Object.assign(Handybars, {
	Text,
	Block,
});
