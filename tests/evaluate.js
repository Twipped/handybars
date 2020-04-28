/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import { Text, Block } from '../src/taxonomy';
import Helpers from '../src/helpers';

const IDENTIFIER  = (v)    => [ 'IDENTIFIER', v ];
const LITERAL     = (v)    => [ 'LITERAL', v ];

tap.test('evaluate 1', (t) => {

	const AST = new Block({
		target: null,
		arguments: [],
		children: [
			new Text({ value: 'a\nb' }),
			new Block({
				target: 'c',
				arguments: [],
			}),
			new Text({ value: 'd' }),
			new Block({
				target: 'e',
				arguments: [],
				children: [
					new Block({
						target: 'f.g',
						arguments: [
							LITERAL('h'),
						],
					}),
					new Text({ value: 'i' }),
				],
			}),
			new Text({ value: '<k>' }),
			new Block({
				target: 'l',
				arguments: [
					IDENTIFIER('m'),
				],
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
		target: null,
		arguments: [],
		children: [
			new Block({
				target: 'if',
				arguments: [ IDENTIFIER('a') ],
				children: [
					new Text({ value: 'b' }),
				],
				alternates: [
					new Block({
						target: 'c',
						arguments: [],
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
