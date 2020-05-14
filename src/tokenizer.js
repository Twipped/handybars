
import { wtf } from './utils';

export default function tokenizer (name) {

	const rules = [];

	function rule (re, fn) {
		if (re instanceof RegExp) rules.push({ re, fn });
		else if (re) rules.push(re);
		return this;
	}

	function parse (input) {
		const tokens = [];
		const len = input.length;
		let pos = 0;
		while (pos < len) {
			const t = test(input.slice(pos));
			if (!t) {
				wtf(`${name} Tokenizer: Could not parse template, unknown token "${input.substring(pos, 100)}"" (${pos})`, { tokens });
			}

			const [ r, match ] = t;
			pos += match[0].length;
			if (!r.fn) continue; // ignore this token
			const res = r.fn(match);
			if (res !== false && res !== undefined) tokens.push(res);
		}
		return tokens;
	}

	function test (input) {
		let i = -1;
		for (const r of rules) {
			i++;
			const match = r.re.exec(input);
			const ok = match && match.index === 0;

			// console.log({ rule: i, test: input, match, ok }, ok && '------------------------');

			if (!ok) continue;
			return [ r, match, i ];
		}
		return null;
	}

	parse.rule = rule;

	return parse;
}
