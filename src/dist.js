
import Handybars, {
	parse,
	evaluate,
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	makeContext,
	safe,
	safeJoin,
} from './index';

Object.assign(Handybars, {
	partial: parse,
	parse,
	evaluate,
	Text,
	Block,
	Invocation,
	Collection,
	Identifier,
	Literal,
	makeContext,
	safe,
	safeJoin,
});

export default Handybars;

