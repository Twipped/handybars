/* eslint quotes:0, new-cap:0 */

import tap from 'tap';
import tokenize, {
	T_WHITESPACE,
	T_TEXT,
	T_BLOCK_START,
	T_BLOCK_STOP,
	T_BLOCK_OPEN,
	T_BLOCK_CLOSE,
	T_ELSE,
	T_IDENTIFIER,
	T_LITERAL_NUM,
	T_LITERAL_STR,
	T_LITERAL_PRI,
	T_BRACKET_OPEN,
	T_BRACKET_CLOSE,
	T_PAREN_OPEN,
	T_PAREN_CLOSE,
	T_ASSIGNMENT,
} from '../src/tokenizer';

const WHITESPACE      = (contents = ' '    ) => ({ type: T_WHITESPACE,    contents });
const TEXT            = (contents = null   ) => ({ type: T_TEXT,          contents });
const BLOCK_START     = (contents = '{{'   ) => ({ type: T_BLOCK_START,   contents });
const BLOCK_STOP      = (contents = '}}'   ) => ({ type: T_BLOCK_STOP,    contents });
const RAW_BLOCK_START = (contents = '{{{'  ) => ({ type: T_BLOCK_START,   contents, raw: true });
const RAW_BLOCK_STOP  = (contents = '}}}'  ) => ({ type: T_BLOCK_STOP,    contents, raw: true });
const BLOCK_OPEN      = (contents = '#'    ) => ({ type: T_BLOCK_OPEN,    contents });
const BLOCK_CLOSE     = (contents = '/'    ) => ({ type: T_BLOCK_CLOSE,   contents });
const ELSE            = (contents = 'else' ) => ({ type: T_ELSE,          contents });
const IDENTIFIER      = (contents = null   ) => ({ type: T_IDENTIFIER,    contents });
const LITERAL_NUM     = (contents = null   ) => ({ type: T_LITERAL_NUM,   contents });
const LITERAL_STR     = (contents = null   ) => ({ type: T_LITERAL_STR,   contents });
const LITERAL_PRI     = (contents          ) => ({ type: T_LITERAL_PRI,   contents });
const BRACKET_OPEN    = (contents = '['    ) => ({ type: T_BRACKET_OPEN,  contents });
const BRACKET_CLOSE   = (contents = ']'    ) => ({ type: T_BRACKET_CLOSE, contents });
const PAREN_OPEN      = (contents = '('    ) => ({ type: T_PAREN_OPEN,    contents });
const PAREN_CLOSE     = (contents = ')'    ) => ({ type: T_PAREN_CLOSE,   contents });
const ASSIGNMENT      = (contents = '='    ) => ({ type: T_ASSIGNMENT,    contents });

function deline (toks) {
	return toks.map(({ line, column, ...rest }) => rest); // eslint-disable-line no-unused-vars
}

tap.test('tokenize 1', (t) => {
	const result = tokenize('a\nb{{c}}d{{#e (f.g) "h\\"}}" [.1 0.1 1 -10 true false null]}}{{i[j] i[j].k x=i.j[k] }}{{else}}1{{/e}}2{{{l m}}}n');

	t.deepEqual(deline(result), [
		TEXT('a\nb'),
		BLOCK_START(),
		IDENTIFIER('c'),
		BLOCK_STOP(),
		TEXT('d'),
		BLOCK_START(),
		BLOCK_OPEN(),
		IDENTIFIER('e'),
		WHITESPACE(),
		PAREN_OPEN(),
		IDENTIFIER('f.g'),
		PAREN_CLOSE(),
		WHITESPACE(),
		LITERAL_STR('h"}}'),
		WHITESPACE(),
		BRACKET_OPEN(),
		LITERAL_NUM('.1'),
		WHITESPACE(),
		LITERAL_NUM('0.1'),
		WHITESPACE(),
		LITERAL_NUM('1'),
		WHITESPACE(),
		LITERAL_NUM('-10'),
		WHITESPACE(),
		LITERAL_PRI(true),
		WHITESPACE(),
		LITERAL_PRI(false),
		WHITESPACE(),
		LITERAL_PRI(null),
		BRACKET_CLOSE(),
		BLOCK_STOP(),
		BLOCK_START(),
		IDENTIFIER('i'),
		BRACKET_OPEN(),
		IDENTIFIER('j'),
		BRACKET_CLOSE(),
		WHITESPACE(),
		IDENTIFIER('i'),
		BRACKET_OPEN(),
		IDENTIFIER('j'),
		BRACKET_CLOSE(),
		IDENTIFIER('k'),
		WHITESPACE(),
		IDENTIFIER('x'),
		ASSIGNMENT(),
		IDENTIFIER('i.j'),
		BRACKET_OPEN(),
		IDENTIFIER('k'),
		BRACKET_CLOSE(),
		WHITESPACE(),
		BLOCK_STOP(),
		BLOCK_START(),
		ELSE(),
		BLOCK_STOP(),
		TEXT('1'),
		BLOCK_START(),
		BLOCK_CLOSE(),
		IDENTIFIER('e'),
		BLOCK_STOP(),
		TEXT('2'),
		RAW_BLOCK_START(),
		IDENTIFIER('l'),
		WHITESPACE(),
		IDENTIFIER('m'),
		RAW_BLOCK_STOP(),
		TEXT('n'),
	]);
	t.end();
});
