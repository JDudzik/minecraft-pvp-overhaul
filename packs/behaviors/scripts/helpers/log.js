const system = server.registerSystem(0, 0);
import emit from './emit';


/**
* Simplifies logging
* @param {...*} items   The variables to log
*/

const log = function(...items) {
	const toString = item => {
		switch(Object.prototype.toString.call(item)) {
			case '[object Undefined]':
				return 'undefined';
			case '[object Null]':
				return 'null';
			case '[object String]':
				return `"${item}"`;
			case '[object Array]':
				const array = item.map(toString);
				return `[${array.join(', ')}]`;
			case '[object Object]':
				const object = Object.keys(item).map(key => `${key}: ${toString(item[key])}`);
				return `{${object.join(', ')}}`;
			case '[object Function]':
				return item.toString();
			default:
				return item;
		}
	}

	emit('minecraft:display_chat_event', {message: items.map(toString).join(' ')});
}


export default log;
