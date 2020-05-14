
import { mark, stop } from 'marky';
import tap from 'tap';
import handybars, { parse } from '../src';
import fs from 'fs';
import path from 'path';

const fixture = fs.readFileSync(path.resolve(__dirname, 'fixture.hbs')).toString('utf8');
const fixtureData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixture.json')).toString('utf8'));

const ITER = 1000;


tap.test('lexing', (t) => {
	mark('lexing');

	let i = ITER;
	while (i--) {
		parse(fixture);
	}

	const result = stop('lexing');
	t.comment(`Total Time: ${result.duration.toFixed(2)}ms  (${(result.duration / ITER).toFixed(2)}ms per iteration)`);
	t.end();

});

tap.test('evaluation', (t) => {
	const tmpl = handybars(fixture, {
		icon: () => null,
		rev: (v) => v,
		date: (v) => v,
	});
	mark('evaluation');

	let i = ITER;
	while (i--) {
		tmpl(fixtureData);
	}

	const result = stop('evaluation');
	t.comment(`Total Time: ${result.duration.toFixed(2)}ms  (${(result.duration / ITER).toFixed(2)}ms per iteration)`);
	t.end();

});

tap.test('round trip', (t) => {
	const env = {
		icon: () => null,
		rev: (v) => v,
		date: (v) => v,
	};
	mark('round');

	let i = ITER;
	while (i--) {
		handybars(fixture, env)(fixtureData);
	}

	const result = stop('round');
	t.comment(`Total Time: ${result.duration.toFixed(2)}ms  (${(result.duration / ITER).toFixed(2)}ms per iteration)`);
	t.end();

});
