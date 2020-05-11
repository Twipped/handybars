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
} from '../src/taxonomy';

tap.test('lex', (t) => {
	const result = lex('a\nb{{c}}d{{#e}}{{f.g z=6.4 ["h" 2]}}i{{/e}}k{{l (m)}}n');

	const expected = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Text({ value: 'a\nb' }),
			new Block({
				type: 'c',
				invoker: new Invocation({
					arguments: [ new Identifier('c') ],
				}),
			}),
			new Text({ value: 'd' }),
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
									new Literal('h'),
									new Literal(2),
								]),
							],
							hash: { z: new Literal(6.4) },
							hashCount: 1,
						}),
					}),
					new Text({ value: 'i' }),
				],
			}),
			new Text({ value: 'k' }),
			new Block({
				type: 'l',
				invoker: new Invocation({ arguments: [
					new Identifier('l', true),
					new Invocation({
						arguments: [ new Identifier('m') ],
					}),
				] }),
			}),
			new Text({ value: 'n' }),
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
					new Text({ value: 'b' }),
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
