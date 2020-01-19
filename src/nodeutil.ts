/**
 * ノード操作に関するユーティリティです。
 */
export module nodeutil {

	export function isIE(): boolean {
		return platform.description === "IE";
	}

	/**
	 * Callback definition
	 */
	export type SearchCallback = (e: Element) => boolean;

	/**
	 * 要素を検索します。
	 * @param e element
	 * @param callback user definition callback function
	 */
	export function searchElement(e: Element, callback: SearchCallback): boolean {

		if (!e)
			return false;

		if (callback(e))
			// Exit when true returned by callback function.
			return true;

		if (e.hasChildNodes()) {
			for (let i = 0; i < e.childElementCount; i++) {
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
	 * 要素にフォーカスを移します。
	 * @param e 要素
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
			e.nodeName, e.attributes.getNamedItem("name"), e.id, rect.top, rect.left);
	}

	/**
	 * 要素の左側にある要素を探します。
	 * @param baseElement 
	 */
	export function getLeftElement(baseElement: Element): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes.getNamedItem("name"), baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findPreviousSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let foundItem: Element | null = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element): boolean => {
			if (!isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (baseRect.left <= rect.left)
				return foundItem != null;
			// 基準要素よりも上の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes.getNamedItem("name"), e.id, rect.top, rect.left);
			foundItem = e;
			// continue.
			return false;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!foundItem)
			console.log("[TRACE] Not found.");
		return foundItem;
	}

	/**
	 * 一つ上の要素を探します。
	 * @param baseElement 
	 */
	export function getUpperElement(baseElement: Element): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes.getNamedItem("name"), baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findPreviousSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let foundItem: Element | null = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element): boolean => {
			if (!nodeutil.isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (baseRect.top < rect.top)
				return foundItem != null;
			// 基準要素よりも上の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes.getNamedItem("name"), e.id, rect.top, rect.left);
			foundItem = e;
			// continue.
			return false;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!foundItem)
			console.log("[TRACE] Not found.");
		return foundItem;
	}

	export function getLowerElement(baseElement: Element): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes.getNamedItem("name"), baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findNextSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let foundItem: Element | null = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element): boolean => {
			if (!isForcusableElement(e))
				return false;
			const rect = e.getBoundingClientRect();
			if (baseElement === e)
				return false;
			if (rect.top < baseRect.top)
				return false;
			// 基準要素よりも下の要素がみつかった
			console.log("[TRACE] element found. type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
				e.nodeName, e.attributes.getNamedItem("name"), e.id, rect.top, rect.left);
			foundItem = e;
			// stop.
			return true;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!foundItem)
			console.log("[TRACE] Not found.");
		return foundItem;
	}

	function findPreviousSiblingControl(e: Element | null): Element | null {
		while (e) {
			e = e.previousElementSibling;
			if (!e)
				break;
			if (isForcusableElement(e)) {
				console.log("[TRACE] 簡易検索(<): ", e);
				return e;
			}
		}
		return null;
	}

	function findNextSiblingControl(e: Element | null): Element | null {
		while (e) {
			e = e.nextElementSibling;
			if (!e)
				break;
			if (isForcusableElement(e)) {
				console.log("[TRACE] 簡易検索(>): ", e);
				return e;
			}
		}
		return null;
	}

	export function getRightElement(baseElement: Element): Element | null {

		// 基準要素の位置
		const baseRect = baseElement.getBoundingClientRect();

		console.log("[TRACE] 基準要素 type: [%s], name: [%s], id: [%s], top: [%s], left: [%s]",
			baseElement.nodeName, baseElement.attributes.getNamedItem("name"), baseElement.id, baseRect.top, baseRect.left);

		// 同じ階層の要素を簡易検索
		{
			const ee = findNextSiblingControl(baseElement);
			if (ee)
				return ee;
		}

		// みつかった要素
		let foundItem: Element | null = null;
		// コールバック
		const handler: nodeutil.SearchCallback = (e: Element): boolean => {
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
				e.nodeName, e.attributes.getNamedItem("name"), e.id, rect.top, rect.left);
			foundItem = e;
			// stop.
			return true;
		}

		// 要素を検索します。
		nodeutil.searchElement(window.document.body, handler);
		if (!foundItem)
			console.log("[TRACE] Not found.");
		return foundItem;
	}
}
