/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import { tokenize, tokenizeArguments } from '../src/lexer';

const IDENTIFIER    = (v)    => [ 'IDENTIFIER', v ];
const LITERAL       = (v)    => [ 'LITERAL', v ];
const EMBED         = (...v) => [ 'EMBED', v ];
const RAW_TEXT      = (v)    => [ 'RAW_TEXT', v ];
const BLOCK_OPEN    = (...v) => [ 'BLOCK_OPEN', v ];
const BLOCK_CLOSE   = (...v) => [ 'BLOCK_CLOSE', v ];
const INSERTION     = (...v) => [ 'INSERTION', v ];
const RAW_INSERTION = (...v) => [ 'INSERTION', v, { raw: true } ];
const ELSE          = () => [ 'ELSE' ];

tap.test('tokenizeArguments', (t) => {
	const result = tokenizeArguments(`e f.g "h" true false 'i' 123 null j[k] (l "m" n) `);

	t.deepEqual(result, [
		IDENTIFIER('e'),
		IDENTIFIER('f.g'),
		LITERAL('h'),
		LITERAL( true),
		LITERAL(false),
		LITERAL('i'),
		LITERAL(123),
		LITERAL(null),
		IDENTIFIER('j[k]'),
		EMBED(
			IDENTIFIER('l'),
			LITERAL('m'),
			IDENTIFIER('n'),
		),
	]);
	t.end();
});

tap.test('tokenize 1', (t) => {
	const result = tokenize('a\nb{{c}}d{{#e f.g "h"}}i{{/e}}k{{{l m}}}n');

	t.deepEqual(result, [
		RAW_TEXT('a\nb'),
		INSERTION(
			IDENTIFIER('c'),
		),
		RAW_TEXT('d'),
		BLOCK_OPEN(
			IDENTIFIER('e'),
			IDENTIFIER('f.g'),
			LITERAL('h'),
		),
		RAW_TEXT('i'),
		BLOCK_CLOSE(
			IDENTIFIER('e'),
		),
		RAW_TEXT('k'),
		RAW_INSERTION(
			IDENTIFIER('l'),
			IDENTIFIER('m'),
		),
		RAW_TEXT('n'),
	]);
	t.end();
});

tap.test('tokenize else', (t) => {
	const result = tokenize('{{#if a}}b{{else}}{{{c}}}{{/if}}');

	t.deepEqual(result, [
		BLOCK_OPEN(
			IDENTIFIER('if'),
			IDENTIFIER('a'),
		),
		RAW_TEXT('b'),
		ELSE(),
		RAW_INSERTION(
			IDENTIFIER('c'),
		),
		BLOCK_CLOSE(
			IDENTIFIER('if'),
		),
	]);
	t.end();
});

