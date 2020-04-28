/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import lex from '../src/lexer';
import { Text, Block } from '../src/taxonomy';

const IDENTIFIER  = (v)    => [ 'IDENTIFIER', v ];
const LITERAL     = (v)    => [ 'LITERAL', v ];

tap.test('lex', (t) => {
	const result = lex('a\nb{{c}}d{{#e}}{{f.g "h"}}i{{/e}}k{{l m}}n');

	const expected = new Block({
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
			new Text({ value: 'k' }),
			new Block({
				target: 'l',
				arguments: [
					IDENTIFIER('m'),
				],
			}),
			new Text({ value: 'n' }),
		],
	});

	t.deepEqual(result, expected);
	t.end();
});


// BLOCK_OPEN(
// 	IDENTIFIER('if'),
// 	IDENTIFIER('a'),
// ),
// RAW_TEXT('b'),
// ELSE(),
// RAW_INSERTION(
// 	IDENTIFIER('c'),
// ),
// BLOCK_CLOSE(
// 	IDENTIFIER('if'),
// ),

tap.test('lex else', (t) => {
	const result = lex('{{#if a}}b{{else}}{{{c}}}{{/if}}');

	const expected = new Block({
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

	t.deepEqual(result, expected);
	t.end();
});
