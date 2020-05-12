
import tap from 'tap';
import handybars, { partial } from '../src/index';
import * as Kit from '../src/kit';

import { test as _if }          from '../src/kit/if';
import { test as each }        from '../src/kit/each';
import { test as _with }        from '../src/kit/with';
import { test as add }          from '../src/kit/add';
import { test as after }        from '../src/kit/after';
import { test as all }          from '../src/kit/all';
import { test as any }          from '../src/kit/any';
import { test as bytes }        from '../src/kit/bytes';
import { test as ceil }         from '../src/kit/ceil';
import { test as compare }      from '../src/kit/compare';
import { test as date }         from '../src/kit/date';
import { test as div }          from '../src/kit/div';
import { test as empty }        from '../src/kit/empty';
import { test as endsWith }     from '../src/kit/endsWith';
import { test as even }         from '../src/kit/even';
import { test as filter }       from '../src/kit/filter';
import { test as first }        from '../src/kit/first';
import { test as floor }        from '../src/kit/floor';
import { test as fromNow }      from '../src/kit/fromNow';
import { test as get }          from '../src/kit/get';
import { test as gt }           from '../src/kit/gt';
import { test as gte }          from '../src/kit/gte';
import { test as has }          from '../src/kit/has';
import { test as includes }     from '../src/kit/includes';
import { test as is }           from '../src/kit/is';
import { test as isLike }       from '../src/kit/isLike';
import { test as isNot }        from '../src/kit/isNot';
import { test as isNotLike }    from '../src/kit/isNotLike';
import { test as join }         from '../src/kit/join';
import { test as keys }         from '../src/kit/keys';
import { test as last }         from '../src/kit/last';
import { test as length }       from '../src/kit/length';
import { test as lowercase }    from '../src/kit/lowercase';
import { test as lt }           from '../src/kit/lt';
import { test as lte }          from '../src/kit/lte';
import { test as max }          from '../src/kit/max';
import { test as mean }         from '../src/kit/mean';
import { test as min }          from '../src/kit/min';
import { test as mul }          from '../src/kit/mul';
import { test as not }          from '../src/kit/not';
import { test as notEmpty }     from '../src/kit/notEmpty';
import { test as number }       from '../src/kit/number';
import { test as numberFormat } from '../src/kit/numberFormat';
import { test as odd }          from '../src/kit/odd';
import { test as ordinalize }   from '../src/kit/ordinalize';
import { test as padEnd }       from '../src/kit/padEnd';
import { test as padStart }     from '../src/kit/padStart';
import { test as phone }        from '../src/kit/phone';
import { test as pow }          from '../src/kit/pow';
import { test as random }       from '../src/kit/random';
import { test as replace }      from '../src/kit/replace';
import { test as reverse }      from '../src/kit/reverse';
import { test as round }        from '../src/kit/round';
import { test as slice }        from '../src/kit/slice';
import { test as slugify }      from '../src/kit/slugify';
import { test as sort }         from '../src/kit/sort';
import { test as split }        from '../src/kit/split';
import { test as startsWith }   from '../src/kit/startsWith';
import { test as stringify }    from '../src/kit/stringify';
import { test as sub }          from '../src/kit/sub';
import { test as ucfirst }      from '../src/kit/ucfirst';
import { test as ucsentences }  from '../src/kit/ucsentences';
import { test as ucwords }      from '../src/kit/ucwords';
import { test as uppercase }    from '../src/kit/uppercase';
import { test as urldecode }    from '../src/kit/urldecode';
import { test as urlencode }    from '../src/kit/urlencode';
import { test as values }       from '../src/kit/values';

const tests = {
	_if,
	_with,
	add,
	after,
	all,
	any,
	bytes,
	ceil,
	compare,
	date,
	div,
	each,
	empty,
	endsWith,
	even,
	filter,
	first,
	floor,
	fromNow,
	get,
	gt,
	gte,
	has,
	includes,
	is,
	isLike,
	isNot,
	isNotLike,
	join,
	keys,
	last,
	length,
	lowercase,
	lt,
	lte,
	max,
	mean,
	min,
	mul,
	not,
	notEmpty,
	number,
	numberFormat,
	odd,
	ordinalize,
	padEnd,
	padStart,
	phone,
	pow,
	random,
	replace,
	reverse,
	round,
	slice,
	slugify,
	sort,
	split,
	startsWith,
	stringify,
	sub,
	ucfirst,
	ucsentences,
	ucwords,
	uppercase,
	urldecode,
	urlencode,
	values,
	layout: (t) => {
		t.multi(
			{
				template: ' {{extend "testingPartial1"}}',
				output: ' <div>yes</div>',
			},
			{
				template: ' {{{extend "testingPartial1"}}}',
				output: ' <div>yes</div>',
			},

			{
				template: ' {{#extend "testingPartial2"}}{{/extend}}',
				output: ' <div>yes</div>',
			},

			{
				template: ' {{#extend "testingPartial3"}}{{#content "target"}}<br>{{/content}}{{/extend}}',
				output: ' <div><br></div>',
			},
			{
				template: ' {{#extend "testingPartial4"}}{{#content "target"}}<br>{{/content}}{{/extend}}',
				output: ' <div><br></div>',
			},
			{
				template: ' {{#extend "testingPartial5"}}{{#content "titleText"}}Hello!{{a}}{{/content}}{{/extend}}',
				input: { a: '<br>' },
				output: ' <div><h1>Hello!&lt;br&gt;</h1></div>',
			},
			{
				template: ' {{#extend "testingPartial5"}}{{#content "title" "append"}}Hello!{{a}}{{/content}}{{/extend}}',
				input: { a: '<br>' },
				output: ' <div><h1>Title</h1>Hello!&lt;br&gt;</div>',
			},
			{
				template: ' {{#extend "testingPartial5"}}{{#append "title"}}Hello!{{a}}{{/append}}{{/extend}}',
				input: { a: '<br>' },
				output: ' <div><h1>Title</h1>Hello!&lt;br&gt;</div>',
			},
			{
				template: ' {{#extend "testingPartial5"}}{{#prepend "title"}}Hello!{{a}}{{/prepend}}{{/extend}}',
				input: { a: '<br>' },
				output: ' <div>Hello!&lt;br&gt;<h1>Title</h1></div>',
			},
		);
	},
};



const env = {
	...Kit,
	testingPartial1: partial('<div>yes</div>'),
	testingPartial2: partial('<div>{{#block "target"}}yes{{/block}}</div>'),
	testingPartial3: partial('<div>{{block "target"}}</div>'),
	testingPartial4: partial('<div>{{{block "target"}}}</div>'),
	testingPartial5: partial('<div>{{#block "title"}}<h1>{{#block "titleText"}}Title{{/block}}</h1>{{/block}}</div>'),
};

for (const [ name, test ] of Object.entries(tests)) {
	tap.test(name, (ts) => {
		let i = 0;
		ts.simple = ({ template, input, output: expected }) => {
			i++;
			var actual;
			try {
				actual = handybars(template, env)(input);
				ts.strictEqual(actual, expected, `${name}#${i}: ${template} ${JSON.stringify(input)}`);
			} catch (e) {
				ts.error(e, `${name}#${i}: ${template} ${JSON.stringify(input)}`);
			}
		};
		ts.multi = (...sets) => {
			sets.forEach(ts.simple);
		};
		test(ts, name);
		ts.end();
	});
}
