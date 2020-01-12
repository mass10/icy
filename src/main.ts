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

module nodeutil {

	/**
	 * コールバックの定義
	 */
	export type SearchCallback = (e: Element | null) => boolean;

	/**
	 * 要素を検索します。
	 * @param e 要素
	 * @param callback ユーザー定義コールバック
	 */
	export function searchElement(e: Element | null, callback: SearchCallback): boolean {

		if (!e)
			return false;

		if (callback(e))
			return true;

		if (e.hasChildNodes()) {
			for (let i = 0; i < e.childElementCount; i++)  {
				const child = e.children[i];
				if (searchElement(child, callback))
					return true;
			}
		}
		return false;
	}
}

module util {

	/**
	 * HTML 要素が <INPUT> かどうかを調べます。
	 * @param e 不明な要素
	 */
	export function isInputElement(e: Element | null): e is HTMLInputElement {
		return e?.nodeName === "INPUT";
	}

	/**
	 * HTML 要素が <TEXTAREA> かどうかを調べます。
	 * @param e 不明な要素
	 */
	export function isTextareaElement(e: Element | null): e is HTMLTextAreaElement {
		return e?.nodeName === "TEXTAREA";
	}

	/**
	 * HTML 要素が <A> かどうかを調べます。
	 * @param e 不明な要素
	 */
	export function isAnchorElement(e: Element | null): e is HTMLAnchorElement {
		return e?.nodeName === "A";
	}

	/**
	 * HTML 要素がフォーカス対象かどうかを調べます。
	 * @param e 不明な要素
	 */
	export function isForcusableElement(e: Element | null): boolean {
		return isInputElement(e) || isTextareaElement(e) || isAnchorElement(e);
	}

	/**
	 * フォーカスされている要素を返します。
	 * フォーカスされている要素が存在しないときは、ドキュメント内の最初の要素を返します。
	 */
	export function getActiveElement(): Element | null {
		// フォーカスされている要素を取得します。
		const activeElement = window.document.activeElement;
		if (activeElement) {
			console.log("[TRACE] アクティブな要素 ... ", activeElement);
			return activeElement;
		}
		// 最初の要素を探します。フォーカス可能な要素に限ります。
		let element = window.document.firstElementChild;
		while (element) {
			if (element.nodeName === "A") break;
			if (element.nodeName === "BUTTON") break;
			if (element.nodeName === "INPUT") break;
			if (element.nodeName === "TEXTAREA") break;
			element = element.nextElementSibling;
		}
		if (!element) {
			console.log("[TRACE] 基準となる要素はありません。");
		}
		console.log("[TRACE] アクティブな要素 ... ", element);
		return element;
	}

	export function setFocus(e: Element): void {

		const options: FocusOptions = { preventScroll: false };
		if (isInputElement(e))
			e.focus(options);
		else if (isTextareaElement(e))
			e.focus(options);
		else if (isAnchorElement(e))
			e.focus(options);
		else
			return;
		const rect = e.getBoundingClientRect();
		console.log("[TRACE] フォーカス設定: type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
	}
}

type SearchCallback = (arg1: Element | null) => boolean;

function getPreviousElement(baseElement: Element | null): Element | null {
	// 基準要素の位置
	const baseRect = baseElement.getBoundingClientRect();
	console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);
	// みつかった要素
	let item: Element = null;
	// コールバック
	const handler: SearchCallback = (e: Element | null): boolean => {
		if (!util.isForcusableElement(e))
			return false;
		const rect = e.getBoundingClientRect();
		if (baseRect.y <= rect.y) {
			if (item)
				return true;
			return false;
		}
		// 基準要素よりも上の要素がみつかった
		console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
		item = e;
		return false;
	}
	// 要素を検索します。
	nodeutil.searchElement(window.document.body, handler);
	return item;
}

function getNextElement(baseElement: Element | null): Element | null {
	// 基準要素の位置
	const baseRect = baseElement.getBoundingClientRect();
	console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);
	// みつかった要素
	let item: Element = null;
	// コールバック
	const handler: SearchCallback = (e: Element | null): boolean => {
		if (!util.isForcusableElement(e))
			return false;
		const rect = e.getBoundingClientRect();
		if (rect.y <= baseRect.y)
			return false;
		// 基準要素よりも下の要素がみつかった
		console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
		item = e;
		// stop.
		return true;
	}
	// 要素を検索します。
	nodeutil.searchElement(window.document.body, handler);
	return item;
}

function _onkeydown(this: GlobalEventHandlers, ev: KeyboardEvent) {

	if (ev.key === "ArrowUp") {
		// 基準となる要素を検索します。
		const activeElement = util.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = getPreviousElement(activeElement);
		if (!previousElement)
			return;
		util.setFocus(previousElement);
	}
	else if (ev.key === "ArrowDown") {
		// 基準となる要素を検索します。
		const activeElement = util.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = getNextElement(activeElement);
		if (!previousElement)
			return;
		util.setFocus(previousElement);
	}
	else if (ev.key === "ArrowLeft") {
		// 基準となる要素を検索します。
		const activeElement = util.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = getPreviousElement(activeElement);
		if (!previousElement)
			return;
		util.setFocus(previousElement);
	}
	else if (ev.key === "ArrowRight") {
		// 基準となる要素を検索します。
		const activeElement = util.getActiveElement();
		if (!activeElement) {
			return;
		}
		// 手前の要素を探します。
		const previousElement = getNextElement(activeElement);
		if (!previousElement)
			return;
		util.setFocus(previousElement);
	}
}

module ttapplication {

	export function run() {

		if (window.onkeydown) {
			const original_operation = window.onkeydown;
			window.onkeydown = function(this: GlobalEventHandlers, ev: KeyboardEvent) {
				if (original_operation)
					original_operation.apply(this, ev);
				_onkeydown.apply(this, ev);
			};
		}
		else {
			window.onkeydown = _onkeydown;
		}
	}
}

ttapplication.run();
