module logger {

	export function trace(...args: any[]): void {
		console.log(dateutil.getTimestamp() + " [TRACE] ", args);
	}
}
