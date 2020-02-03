import { test1 } from './test1';

describe("test1 をテストします。", () => {

	it("test1.run() が文字列 \"false\" を返すこと。", () => {
		expect(test1.run()).toBe("false");
	});
});
