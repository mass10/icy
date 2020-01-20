import { nodeutil } from "nodeutil";
import platform from "platform";

function _onkeydown(this: GlobalEventHandlers, ev: KeyboardEvent) {

	console.log("[TRACE]");
	if (ev.key === "ArrowUp") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const aboveElement = nodeutil.getUpperElement(activeElement);
		if (!aboveElement)
			return;
		nodeutil.setFocus(aboveElement);
	}
	else if (ev.key === "ArrowDown") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const belowElement = nodeutil.getLowerElement(activeElement);
		if (!belowElement)
			return;
		nodeutil.setFocus(belowElement);
	}
	else if (ev.key === "ArrowLeft") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const leftElement = nodeutil.getLeftElement(activeElement);
		if (!leftElement)
			return;
		nodeutil.setFocus(leftElement);
	}
	else if (ev.key === "ArrowRight") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const rightElement = nodeutil.getRightElement(activeElement);
		if (!rightElement)
			return;
		nodeutil.setFocus(rightElement);
	}
}

export module icy {

	export function run() {

		console.log("#################################### START ICY ###");
		console.log("[TARCE] <icy.run()>", platform);

		if (window.onkeydown) {
			const original_operation = window.onkeydown;
			window.onkeydown = function (this: GlobalEventHandlers, ev: KeyboardEvent) {
				if (original_operation) {
					original_operation.apply(window, [ev]);
				}
				_onkeydown.apply(this, [ev]);
			};
		}
		else {
			window.onkeydown = _onkeydown;
		}
	}
}

icy.run();
