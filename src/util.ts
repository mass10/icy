module dateutil {

	export function rpad(s: string, len: number): string {

		s = "" + s;
		while (s.length < len) {
			s = "0" + s;
		}
		return s;
	}

	export function getTimestamp(): string {

		const now = new Date();
		const year = now.getFullYear();
		const month = 1 + now.getMonth();
		const day = now.getDate();
		const hour = now.getHours();
		const minutes = + now.getMinutes();
		const seconds = now.getSeconds();
		const milliseconds = now.getMilliseconds();

		return "" + rpad("" + year, 4) + "-" + rpad("" + month, 2) + "-" + rpad("" + day, 2) +
			" " + rpad("" + hour, 2) + ":" + rpad("" + minutes, 2) + ":" + rpad("" + seconds, 2) + "." + rpad("" + milliseconds, 3);
	}
}

module logger {

	export function trace(...args: any[]): void {
		console.log(dateutil.getTimestamp() + " [TRACE] ", args);
	}
}
