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

tap.test('evaluate 1', (t) => {

	const AST = new Block({
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
								new Literal('h'),
							],
						}),
					}),
					new Text({ value: 'i' }),
				],
			}),
			new Text({ value: '<k>' }),
			new Block({
				type: 'l',
				invoker: new Invocation({
					arguments: [
						new Identifier('l', true),
						new Identifier('m'),
					],
				}),
			}),
			new Text({ value: 'n' }),
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
