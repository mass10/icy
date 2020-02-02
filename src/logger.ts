import { util } from './util';

module logger {

	export function trace(...args: any[]): void {
		console.log(util.getTimestamp() + " [TRACE] ", args);
	}
}
