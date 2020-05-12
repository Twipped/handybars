
export * as All from './kit';

import {
	log,
	if as _if,
	not,
	has,
	is,
	isNot,
	all,
	any,
	with as _with,
	each,
} from './kit';

const helpers = {
	if:     _if,
	with:   _with,
	each,
	log,
	not,
	has,
	is,
	isNot,
	all,
	any,
};

export default helpers;

export {
	helpers as Default,
};
