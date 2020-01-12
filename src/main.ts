module nodeutil {

	/**
	 * Callback definition
	 */
	export type SearchCallback = (e: Element | null) => boolean;

	/**
	 * Find element
	 * @param e element
	 * @param callback user definition callback function
	 */
	export function searchElement(e: Element | null, callback: SearchCallback): boolean {

		if (!e)
			return false;

		if (callback(e))
			// Exit when true returned by callback function.
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

	/**
	 * Set e focused.
	 * @param e element to set focus 
	 */
	export function setFocus(e: Element): void {

		if (isInputElement(e))
			e.focus({ preventScroll: false });
		else if (isTextareaElement(e))
			e.focus({ preventScroll: false });
		else if (isAnchorElement(e))
			e.focus({ preventScroll: false });
		else
			return;
		const rect = e.getBoundingClientRect();
		console.log("[TRACE] Focus changed. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
	}

	export function getLeftElement(baseElement: Element | null): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findPreviousSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let item: Element = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element | null): boolean => {
			if (!isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (baseRect.left <= rect.left)
				return item != null;
			// 基準要素よりも上の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
					e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
			item = e;
			// continue.
			return false;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!item)
			console.log("[TRACE] Not found.");
		return item;
	}

	/**
	 * 一つ上の要素を探します。
	 * @param baseElement 
	 */
	export function getUpperElement(baseElement: Element | null): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findPreviousSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let item: Element = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element | null): boolean => {
			if (!nodeutil.isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (baseRect.y < rect.y)
				return item != null;
			// 基準要素よりも上の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
					e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
			item = e;
			// continue.
			return false;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!item)
			console.log("[TRACE] Not found.");
		return item;
	}

	export function getLowerElement(baseElement: Element | null): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findNextSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let item: Element = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element | null): boolean => {
			if (!isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (rect.top < baseRect.top)
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
		if (!item)
			console.log("[TRACE] Not found.");
		return item;
	}

	function findPreviousSiblingControl(e: Element | null): Element | null {
		console.log("[TRACE] 簡易検索");
		while (true) {
			e = e.previousElementSibling;
			if (!e)
				break;
			console.log("[TRACE] 簡易検索(<): ", e);
			if (isForcusableElement(e))
				return e;
		}
		return null;
	}

	function findNextSiblingControl(e: Element | null): Element | null {
		console.log("[TRACE] 簡易検索");
		while (true) {
			e = e.nextElementSibling;
			if (!e)
				break;
			console.log("[TRACE] 簡易検索(>): ", e);
			if (isForcusableElement(e))
				return e;
		}
		return null;
	}

	export function getRightElement(baseElement: Element | null): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				baseElement.nodeName, baseElement.attributes["name"], baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findNextSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let item: Element = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element | null): boolean => {
			if (!nodeutil.isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (rect.left < baseRect.left)
				return false;
			if (rect.top < baseRect.top)
				return false;
			// 基準要素よりも右下の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
					e.nodeName, e.attributes["name"], e.id, rect.top, rect.left);
			item = e;
			// stop.
			return true;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!item)
			console.log("[TRACE] Not found.");
		return item;
	}
}

function _onkeydown(this: GlobalEventHandlers, ev: KeyboardEvent) {

	if (ev.key === "ArrowUp") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = nodeutil.getUpperElement(activeElement);
		if (!previousElement)
			return;
		nodeutil.setFocus(previousElement);
	}
	else if (ev.key === "ArrowDown") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = nodeutil.getLowerElement(activeElement);
		if (!previousElement)
			return;
		nodeutil.setFocus(previousElement);
	}
	else if (ev.key === "ArrowLeft") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement)
			return;
		// 手前の要素を探します。
		const previousElement = nodeutil.getLeftElement(activeElement);
		if (!previousElement)
			return;
		nodeutil.setFocus(previousElement);
	}
	else if (ev.key === "ArrowRight") {
		// 基準となる要素を検索します。
		const activeElement = nodeutil.getActiveElement();
		if (!activeElement) {
			return;
		}
		// 手前の要素を探します。
		const previousElement = nodeutil.getRightElement(activeElement);
		if (!previousElement)
			return;
		nodeutil.setFocus(previousElement);
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
