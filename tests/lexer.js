/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import lex from '../src/lexer';
import {
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	CompoundIdentifier,
} from '../src/taxonomy';
import {
	T_LITERAL_NUM,
	T_LITERAL_STR,
	T_LITERAL_PRI,
} from '../src/tokenizer';

tap.test('lex', (t) => {
	const result = lex('a\nb{{c}}d{{#e}}{{f.g z=6.4 ["h" 2]}}i{{/e}}k{{l (m) true false null }}n');

	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Text('a\nb'),
			new Block({
				type: 'c',
				invoker: new Invocation({
					arguments: [ new Identifier('c') ],
				}),
			}),
			new Text('d'),
			new Block({
				type: 'e',
				invoker: new Invocation({
					arguments: [ new Identifier('e') ],
				}),
				left: [
					new Block({
						type: 'f.g',
						invoker: new Invocation({
							arguments: [
								new Identifier('f.g', true),
								new Collection([
									new Literal('h', T_LITERAL_STR),
									new Literal('2', T_LITERAL_NUM),
								]),
							],
							hash: { z: new Literal('6.4', T_LITERAL_NUM) },
							hashCount: 1,
						}),
					}),
					new Text('i'),
				],
			}),
			new Text('k'),
			new Block({
				type: 'l',
				invoker: new Invocation({ arguments: [
					new Identifier('l', true),
					new Invocation({
						arguments: [ new Identifier('m', true) ],
					}),
					new Literal(true, T_LITERAL_PRI),
					new Literal(false, T_LITERAL_PRI),
					new Literal(null, T_LITERAL_PRI),
				] }),
			}),
			new Text('n'),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});

tap.test('lex else', (t) => {
	const result = lex('{{#if a}}b{{else}}{{{c}}}{{/if}}');

	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Block({
				type: 'if',
				invoker: new Invocation({
					arguments: [
						new Identifier('if', true),
						new Identifier('a'),
					],
				}),
				left: [
					new Text('b'),
				],
				right: [
					new Block({
						type: 'c',
						invoker: new Invocation({
							arguments: [ new Identifier('c') ],
						}),
						raw: true,
					}),
				],
			}),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});

tap.test('empty block', (t) => {
	const result = lex('{{#if a}}{{/if}}');

	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Block({
				type: 'if',
				invoker: new Invocation({
					arguments: [
						new Identifier('if', true),
						new Identifier('a'),
					],
				}),
				left: [
					new Text(),
				],
			}),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});

tap.test('empty block w/ else', (t) => {
	const result = lex('{{#if \na}}{{else}}{{/if}}');

	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Block({
				type: 'if',
				invoker: new Invocation({
					arguments: [
						new Identifier('if', true),
						new Identifier('a'),
					],
				}),
				left: [
					new Text(),
				],
				right: [
					new Text(),
				],
			}),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});

tap.test('compound identifier', (t) => {
	const result = lex('{{items["a"]}}{{#each ids}}{{items[this].id}}{{/each}}', false);
	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Block({
				type: 'items',
				invoker: new Invocation({ arguments: [
					new CompoundIdentifier('items', [ new Literal('a', T_LITERAL_STR) ]),
				] }),
			}),
			new Block({
				type: 'each',
				invoker: new Invocation({
					arguments: [
						new Identifier('each', true),
						new Identifier('ids'),
					],
				}),
				left: [
					new Block({
						type: 'items',
						invoker: new Invocation({ arguments: [
							new CompoundIdentifier('items', [
								{ r: new Identifier('this') },
								new Identifier('id'),
							]),
						] }),
					}),
				],
			}),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});
