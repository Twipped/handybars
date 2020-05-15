/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import {
	Text,
	Block,
	Invocation,
	Identifier,
	Literal,
} from '../src/taxonomy';
import Helpers from '../src/helpers';
import { parse, makeContext } from '../src/index';
import {
	// T_LITERAL_NUM,
	T_LITERAL_STR,
	// T_LITERAL_PRI,
} from '../src/tokenizer';

tap.test('evaluate 1', (t) => {

	const AST = new Block({
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
								new Literal('h', T_LITERAL_STR),
							],
						}),
					}),
					new Text('i'),
				],
			}),
			new Text('<k>'),
			new Block({
				type: 'l',
				invoker: new Invocation({
					arguments: [
						new Identifier('l', true),
						new Identifier('m'),
					],
				}),
			}),
			new Text('n'),
		],
	});

	t.strictEqual(
		AST.evaluate({
			c: 'C',
			e: () => null,
			l: () => 'L',
		}).value,
		'a\nbCd<k>Ln',
	);
	t.strictEqual(
		AST.evaluate({
			c: () => 'C',
			e: 1,
			l: (v) => v,
			f: {
				g: (v) => v,
			},
		}).value,
		'a\nbCdhi<k>n',
	);

	t.strictEqual(
		AST.evaluate({
			c: () => '<a tag />',
			e: 1,
			l: (v) => ({ value: v }),
			f: {
				g: (v) => '<p>' + v + '</p>',
			},
			m: '<m>',
		}).value,
		'a\nb&lt;a tag /&gt;d&lt;p&gt;h&lt;/p&gt;i<k><m>n',
	);
	t.end();
});

tap.test('evaluate else', (t) => {

	const AST = new Block({
		type: 'ROOT',
		invoker: null,
		left: [
			new Block({
				type: 'if',
				invoker: new Invocation({
					arguments: [ new Identifier('a') ],
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

	t.strictEqual(
		AST.evaluate({
			a: true,
		}, Helpers).value,
		'b',
	);
	t.strictEqual(
		AST.evaluate({
			a: false,
			c: 'C',
		}, Helpers).value,
		'C',
	);
	t.end();
});

tap.test('nested lookup', (t) => {
	const AST = parse('{{items["a"]}}{{#each ids}}{{items[this]}}{{/each}}');
	const data = {
		ids: [ 'a', 'b', 'c' ],
		items: {
			a: 1,
			b: 2,
			c: 3,
		},
	};
	const env = makeContext(data, Helpers);

	t.strictEqual(
		AST.evaluate(data, env).value,
		'1123',
	);
	t.end();
});
