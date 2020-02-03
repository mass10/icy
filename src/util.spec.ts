import { util } from './util';

describe("util をテストします。", () => {

	it("util.getTrue() が true を返すこと。", () => {
		expect(util.getTrue()).toBe(true);
	});

	it("util.getTimestamp() がタイムスタンプ文字列を返すこと。", () => {
		const timestamp = util.getTimestamp();
		expect(timestamp).toMatch(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]/);
	});
});
