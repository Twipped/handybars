
import { anyOf } from './utils';

export const T_WHITESPACE    = 0;
export const T_TEXT          = 1;
export const T_BLOCK_OPEN    = 2;
export const T_BLOCK_STOP    = 3;
export const T_BLOCK_START   = 4;
export const T_BLOCK_CLOSE   = 5;
export const T_ELSE          = 6;
export const T_IDENTIFIER    = 7;
export const T_LITERAL_NUM   = 8;
export const T_LITERAL_STR   = 9;
export const T_LITERAL_PRI   = 10;
export const T_BRACKET_OPEN  = 11;
export const T_BRACKET_CLOSE = 12;
export const T_PAREN_OPEN    = 13;
export const T_PAREN_CLOSE   = 14;
export const T_ASSIGNMENT    = 15;

export const T = [
	'WHITESPACE',
	'TEXT',
	'BLOCK_OPEN',
	'BLOCK_STOP',
	'BLOCK_START',
	'BLOCK_CLOSE',
	'ELSE',
	'IDENTIFIER',
	'LITERAL_NUM',
	'LITERAL_STR',
	'LITERAL_PRI',
	'BRACKET_OPEN',
	'BRACKET_CLOSE',
	'PAREN_OPEN',
	'PAREN_CLOSE',
	'ASSIGNMENT',
];

const LF            = 10;
const CR            = 13;
const SPACE         = 32;
const NBSP          = 160;
const CURL_OPEN     = 123;// {
const CURL_CLOSE    = 125;// }
const BRACKET_OPEN  = 91; // [
const BRACKET_CLOSE = 93; // ]
const PAREN_OPEN    = 40; // (
const PAREN_CLOSE   = 41; // )
const HASH          = 35; // #
const SLASH         = 47; // /
const BACKSLASH     = 92; // \
const DOLLAR        = 36; // $
const EQUAL         = 61; // =
const AT            = 64; // @
const UNDERSCORE    = 95; // _
const PERIOD        = 46; // .
const MINUS         = 45; // -
const QUOT          = 39; // '
const DOUBLEQUOT    = 34; // "

const isAlpha = (char) => (char >= 65 && char <= 90) || (char >= 97 && char <= 122);
const isNumeric = (char) => (char >= 48 && char <= 57);
const isIdent = anyOf(isAlpha, isNumeric, UNDERSCORE, AT, DOLLAR, PERIOD);
const isMinusPeriod = (char) => (char === MINUS || char === PERIOD);
const isQuot = (char) => (char === QUOT || char === DOUBLEQUOT);

export default function tokenizer (input) {
	const max = input.length - 1;
	let inside = false;
	let pos = 0;
	let line = 1;
	let col = 1;

	const tokens = [];
	let tindex = -1;

	function token (type, contents = null, l = line, c = col) {
		const tok = { type, contents, line: l, column: c };
		tokens.push(tok);
		return tok;
	}

	const err = new SyntaxError();
	function wtf (msg, { l = line, c = col, ...extra } = {}) {
		err.message = msg + ` (${l}:${c})`;
		console.dir(tokens); // eslint-disable-line no-console
		throw Object.assign(err, extra, { line: l, column: c });
	}

	function plc () { return { p: pos, l: line, c: col }; }

	function matchWord (value) {
		return input.startsWith(value, pos);
	}

	function peek (delta = 0) {
		const i = pos + delta;
		if (i > max || i < 0) return;
		return input.charCodeAt(i);
	}

	function parseChar (char) {
		if (char === CR || char === LF) {
			line++;
			col = 1;
			// account for CRLF
			if (char === CR && input.charCodeAt(pos) === LF) {
				pos++;
			}
		} else {
			col++;
		}
	}

	function move (delta = 1) {
		const index = Math.min(max + 1, Math.max(0, pos + delta));
		if (delta > 0) for (let i = pos; i < index; i++) parseChar(input.charCodeAt(i));
		pos = index;
		return pos <= max;
	}

	function eof () {
		return pos > max;
	}

	function readRaw () {
		if (inside) return;
		let char = peek();
		const { p, l, c } = plc();
		do {
			if (char === CURL_OPEN && peek(1) === CURL_OPEN) break;
			move();
		} while ((char = peek()));
		if (p === pos) return;
		token(T_TEXT, input.slice(p, pos), l, c);
		return true;
	}

	function readBlockStart () {
		if (inside || peek(0) !== CURL_OPEN || peek(1) !== CURL_OPEN) return;
		inside = true;
		const tok = token(T_BLOCK_START, '{{');
		if (peek(2) === CURL_OPEN) {
			tok.raw = true;
			tok.contents = '{{{';
			move(3);
		} else move(2);
		if (peek() === HASH) {
			token(T_BLOCK_OPEN, '#');
			move(1);
		} else if (peek() === SLASH) {
			token(T_BLOCK_CLOSE, '/');
			move(1);
		} else if (matchWord('else') || matchWord('ELSE')) {
			token(T_ELSE, 'else');
			move(4);
		}
		return true;
	}

	function readBlockEnd () {
		if (!inside || peek(0) !== CURL_CLOSE || peek(1) !== CURL_CLOSE) return;
		inside = false;
		const tok = token(T_BLOCK_STOP, '}}');
		if (peek(2) === CURL_CLOSE) {
			tok.raw = true;
			tok.contents = '}}}';
			move(3);
		} else move(2);
		return true;
	}

	function readWhitespace () {
		if (!inside) return;
		const { p, l, c } = plc();
		let char;
		while (pos <= max && (char = peek(0))) {
			if (char > 14 && char !== SPACE && char !== NBSP) break;
			move();
		}
		if (p === pos) return;
		token(T_WHITESPACE, input.slice(p, pos), l, c);
		return true;
	}

	function readParenStart () {
		if (!inside || peek() !== PAREN_OPEN) return;
		token(T_PAREN_OPEN, '(');
		move();
		return true;
	}

	function readParenEnd () {
		if (!inside || peek() !== PAREN_CLOSE) return;
		token(T_PAREN_CLOSE, ')');
		move();

		// If the paren is followed by a period, then we are accessing something off the result
		if (peek() === PERIOD) move();
		return true;
	}


	function readBrackStart () {
		if (!inside || peek() !== BRACKET_OPEN) return;
		token(T_BRACKET_OPEN, '[');
		move();
		return true;
	}

	function readBrackEnd () {
		if (!inside || peek() !== BRACKET_CLOSE) return;
		token(T_BRACKET_CLOSE, ']');
		move();
		if (peek() === PERIOD) move();
		return true;
	}


	function readAssignment () {
		if (!inside || peek() !== EQUAL) return;
		token(T_ASSIGNMENT, '=');
		move();
		return true;
	}

	function readIdentifier () {
		let char = peek();
		if (!inside || isNumeric(char) || !isIdent(char) || char === PERIOD) return;
		const { p, l, c } = plc();
		move();
		while ((char = peek())) {
			if (!isIdent(char)) break;
			move();
		}
		if (p === pos) return;
		const contents = input.slice(p, pos);
		if (contents === 'true')       token(T_LITERAL_PRI, true, l, c);
		else if (contents === 'false') token(T_LITERAL_PRI, false, l, c);
		else if (contents === 'null')  token(T_LITERAL_PRI, null, l, c);
		else token(T_IDENTIFIER, contents, l, c);
		return true;
	}

	function readNumber () {
		if (!inside) return;
		let char = peek();
		if (!isNumeric(char) && !isMinusPeriod(char)) return;
		if (isMinusPeriod(char) && !isNumeric(peek(1))) return;
		const { p, l, c } = plc();
		let hasPeriod = false;

		do {
			if (char === MINUS) {
				if (pos !== p) break;
				move();
				continue;
			}
			// found a minus after the start of the number, this is not part of the token.

			if (char === PERIOD) {
				if (hasPeriod) break; // we found an extra period, not part of the token.
				hasPeriod = true;
			} else if (!isNumeric(char)) break;
			// found something that was neither number nor period, not part of the token.

			move();
		} while ((char = peek()));

		if (p === pos) return;
		token(T_LITERAL_NUM, input.slice(p, pos), l, c);
		return true;
	}

	function readString () {
		let char = peek();
		if (!inside || !isQuot(char)) return;
		const { p, l, c } = plc();
		const fence = char;
		move();
		while ((char = peek())) {
			if (char === BACKSLASH) {
				move(2);
				continue;
			}
			if (char === fence) {
				token(T_LITERAL_STR, pos - p === 1 ? '' : input.slice(p + 1, pos).replace(/\\(.)/, '$1'),  l, c);
				move();
				return true;
			}
			move();
		}
		wtf(`Unterminated string literal: ${input.substr(p, 20)}…`, { l, c });
	}

	function read () {
		if (eof()) return false;
		for (const r of read.order) {
			// console.log(r, pos);
			if (r()) return true;
		}
		wtf(`Unknown token: ${input.substr(pos, 20)}…`);
	}
	read.order = [
		readBlockStart,
		readRaw,
		readWhitespace,
		readIdentifier,
		readNumber,
		readString,
		readAssignment,
		readBrackStart,
		readBrackEnd,
		readParenStart,
		readParenEnd,
		readBlockEnd,
	];

	return {
		get eof () {
			return eof();
		},
		get current () {
			while (tindex >= tokens.length && !eof()) read();
			return tokens[tindex];
		},
		readAll () {
			while (read());
			return tokens;
		},
		reset () {
			tindex = -1;
			return this;
		},
		next () {
			tindex++;
			while (tindex >= tokens.length && !eof()) read();
			return tokens[tindex];
		},
		peek (delta = 1) {
			const idx = tindex + delta;
			while (idx >= tokens.length && !eof()) read();
			return tokens[idx];
		},

	};
}
