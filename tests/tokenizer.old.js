/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import { tokenize, tokenizeArguments } from '../src/lexer';

const IDENTIFIER    = (v)    => [ 'IDENTIFIER', v ];
const COMP_IDENTIFIER = (v)  => [ 'IDENTIFIER', v, { 'BRACKET_OPEN': 'BRACKET_OPEN' } ];
const LITERAL       = (v)    => [ 'LITERAL', v ];
const RAW_TEXT      = (v)    => [ 'RAW_TEXT', v ];
const BLOCK_OPEN    = (...v) => [ 'BLOCK_OPEN', v ];
const BLOCK_CLOSE   = (...v) => [ 'BLOCK_CLOSE', v ];
const INSERTION     = (...v) => [ 'INSERTION', v ];
const RAW_INSERTION = (...v) => [ 'INSERTION', v, { raw: true } ];
const ASSIGNMENT    = (v)    => [ 'ASSIGNMENT', v ];
const ELSE          = () => [ 'ELSE' ];
const BRACKET_OPEN      = () => [ 'BRACKET_OPEN' ];
const BRACKET_CONTINUE  = () => [ 'BRACKET_CONTINUE' ];
const BRACKET_APPEND    = () => [ 'BRACKET_APPEND' ];
const BRACKET_CLOSE     = () => [ 'BRACKET_CLOSE' ];
const PAREN_OPEN        = () => [ 'PAREN_OPEN' ];
const PAREN_CLOSE       = () => [ 'PAREN_CLOSE' ];

tap.test('tokenizeArguments', (t) => {
	t.deepEqual(
		tokenizeArguments(`e f.g "h" true [a 'b' c.d] false z=2 'i' 123 null j[k][5].m (n "o") `),
		[
			IDENTIFIER('e'),
			IDENTIFIER('f.g'),
			LITERAL('h'),
			LITERAL(true),
			BRACKET_OPEN(),
			IDENTIFIER('a'),
			LITERAL('b'),
			IDENTIFIER('c.d'),
			BRACKET_CLOSE(),
			LITERAL(false),
			ASSIGNMENT('z'),
			LITERAL(2),
			LITERAL('i'),
			LITERAL(123),
			LITERAL(null),
			COMP_IDENTIFIER('j'),
			IDENTIFIER('k'),
			BRACKET_CONTINUE(),
			LITERAL(5),
			BRACKET_APPEND(),
			IDENTIFIER('m'),
			PAREN_OPEN(),
			IDENTIFIER('n'),
			LITERAL('o'),
			PAREN_CLOSE(),
		],
	);
	t.deepEqual(
		tokenizeArguments(`[a[b].c (d) false] z`),
		[
			BRACKET_OPEN(),
			COMP_IDENTIFIER('a'),
			IDENTIFIER('b'),
			BRACKET_APPEND(),
			IDENTIFIER('c'),
			PAREN_OPEN(),
			IDENTIFIER('d'),
			PAREN_CLOSE(),
			LITERAL(false),
			BRACKET_CLOSE(),
			IDENTIFIER('z'),
		],
	);
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

tap.test('tokenize smallblock', (t) => {
	const result = tokenize('{{#if a}}{{log}}{{else}}{{{c}}}{{/if}}');

	t.deepEqual(result, [
		BLOCK_OPEN(
			IDENTIFIER('if'),
			IDENTIFIER('a'),
		),
		INSERTION(
			IDENTIFIER('log'),
		),
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

