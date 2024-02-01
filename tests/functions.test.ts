import {expect, test} from "vitest";
import {describe} from "node:test";
import {checkFileType, checkFormat} from "src/functions";
describe("functions", () => {
	describe("checkFileType", () => {
		describe("should be true", () => {
			test("PNG", () => {
				expect(checkFileType("Image Name.png")).toStrictEqual(true);
			});

			test("JPEG", () => {
				expect(checkFileType("Image Name.jpeg")).toStrictEqual(true);
			});

			test("JPG", () => {
				expect(checkFileType("Image Name.jpg")).toStrictEqual(true);
			});

			test("GIF", () => {
				expect(checkFileType("Image Name.gif")).toStrictEqual(true);
			});

			test("BMP", () => {
				expect(checkFileType("Image Name.bmp")).toStrictEqual(true);
			});

			test("PBM", () => {
				expect(checkFileType("Image Name.pbm")).toStrictEqual(true);
			});

			test("WEBP", () => {
				expect(checkFileType("Image Name.webp")).toStrictEqual(true);
			});
		});
		describe("should be false", () => {
			test("PDF", () => {
				expect(checkFileType("Image Name.pdf")).toStrictEqual(false);
			});

			test("SVG", () => {
				expect(checkFileType("Image Name.svg")).toStrictEqual(false);
			});

			test("String", () => {
				expect(
					checkFileType("abcdefghijklmnopqrstuvwxyz")
				).toStrictEqual(false);
			});
		});
	});

	describe("checkFormat", () => {
		test("Obsidian Internal Image", () => {
			expect(checkFormat("![[Image Name.png]]")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("MD Internal Image", () => {
			expect(checkFormat("![Image](Image Name.png)")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("Obsidian External Image", () => {
			expect(
				checkFormat("![[https://www.test.com/Name.png]]")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("MD External Image", () => {
			expect(
				checkFormat("![Image](https://www.test.com/Name.png)")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("URL", () => {
			expect(checkFormat("https://www.test.com/Name.png")).toStrictEqual(
				undefined
			);
		});
	});
});
