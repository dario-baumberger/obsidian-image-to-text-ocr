import {expect, test} from "vitest";
import {describe} from "node:test";
import {
	checkFileType,
	extractPath,
	isMarkdownTag,
	isObsidianTag,
	isValidUrl
} from "src/functions";
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

	describe("isObsidianTag", () => {
		describe("should be true", () => {
			test("Obsidian Tag", () => {
				expect(isObsidianTag("![[Image Name.png]]")).toStrictEqual(
					true
				);
			});
		});
		describe("should be false", () => {
			test("Not Obsidian Tag", () => {
				expect(isObsidianTag("![Image Name.png]")).toStrictEqual(false);
			});
		});
	});

	describe("isMarkdownTag", () => {
		describe("should be true", () => {
			test("Markdown Tag", () => {
				expect(
					isMarkdownTag("![Image](https://www.test.com/Name.png)")
				).toStrictEqual(true);
			});
		});
		describe("should be false", () => {
			test("Not Markdown Tag", () => {
				expect(isMarkdownTag("![Image Name.png]")).toStrictEqual(false);
			});
		});
	});

	describe("extractPath", () => {
		test("Obsidian Internal Image", () => {
			expect(extractPath("![[Image Name.png]]")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("MD Internal Image", () => {
			expect(extractPath("![Image](Image Name.png)")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("Obsidian External Image", () => {
			expect(
				extractPath("![[https://www.test.com/Name.png]]")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("MD External Image", () => {
			expect(
				extractPath("![Image](https://www.test.com/Name.png)")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("URL", () => {
			expect(extractPath("https://www.test.com/Name.png")).toStrictEqual(
				undefined
			);
		});
	});

	describe("isValidUrl", () => {
		describe("should be true", () => {
			test("http", () => {
				expect(isValidUrl("http://example.com")).toStrictEqual(true);
			});

			test("http", () => {
				expect(isValidUrl("https://www.example.com")).toStrictEqual(
					true
				);
			});

			test("with path", () => {
				expect(
					isValidUrl("https://www.example.com/test/123/lo-rem")
				).toStrictEqual(true);
			});

			test("with file", () => {
				expect(
					isValidUrl("https://www.example.com/test/123/lo-rem.png")
				).toStrictEqual(true);
			});
		});
		describe("should be false", () => {
			test("no protocol", () => {
				expect(isValidUrl("www.example.com")).toStrictEqual(false);
			});

			test("no www", () => {
				console.log(isValidUrl("example.com"));
				expect(isValidUrl("example.com")).toStrictEqual(false);
			});

			test("string", () => {
				expect(isValidUrl("example")).toStrictEqual(false);
			});
		});
	});
});
