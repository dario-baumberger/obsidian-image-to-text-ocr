import {expect, test} from "vitest";
import {describe} from "node:test";
import {
	checkFileType,
	extractMdPath,
	extractObsidianPath,
	extractSrc,
	isImgTag,
	isMarkdownTag,
	isObsidianTag,
	isValidUrl,
	normalizeAltText,
	insertAltTextToObsidian,
	insertAltTextToMarkdown,
	insertAltTextToHtmlImg
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

	describe("isImgTag", () => {
		describe("should be true", () => {
			test("Img Tag", () => {
				expect(
					isImgTag(
						"<img src='https://www.test.com/Name.png' alt='drawing' style='width:200px;'/>"
					)
				).toStrictEqual(true);
			});
		});
		describe("should be false", () => {
			test("Not Img Tag", () => {
				expect(
					isImgTag(
						"<img src='https://www.test.com/Name.png' alt='drawing' style='width:200px;'>"
					)
				).toStrictEqual(false);
			});
		});
	});

	describe("extractSrc", () => {
		test("src attr", () => {
			expect(extractSrc("<img src='test.png'>")).toStrictEqual(
				"test.png"
			);
		});

		test("No src attr", () => {
			expect(extractSrc("<img srcset='test.png'>")).toStrictEqual(
				undefined
			);
		});
	});

	describe("extractMdPath", () => {
		test("MD Internal Image", () => {
			expect(extractMdPath("![Image](Image Name.png)")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("MD External Image", () => {
			expect(
				extractMdPath("![Image](https://www.test.com/Name.png)")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("Obsidian External Image", () => {
			expect(
				extractMdPath("![[https://www.test.com/Name.png]]")
			).toStrictEqual(undefined);
		});
		test("Obsidian Internal Image", () => {
			expect(extractMdPath("![[Image Name.png]]")).toStrictEqual(
				undefined
			);
		});
		test("URL", () => {
			expect(
				extractMdPath("https://www.test.com/Name.png")
			).toStrictEqual(undefined);
		});
	});

	describe("extractObsidianPath", () => {
		test("Obsidian External Image", () => {
			expect(
				extractObsidianPath("![[https://www.test.com/Name.png]]")
			).toStrictEqual("https://www.test.com/Name.png");
		});
		test("Obsidian Internal Image", () => {
			expect(extractObsidianPath("![[Image Name.png]]")).toStrictEqual(
				"Image Name.png"
			);
		});
		test("Obsidian Internal Image with size", () => {
			expect(
				extractObsidianPath("![[Image Name.png|300]]")
			).toStrictEqual("Image Name.png");
		});
		test("MD Internal Image", () => {
			expect(
				extractObsidianPath("![Image](Image Name.png)")
			).toStrictEqual(undefined);
		});
		test("MD External Image", () => {
			expect(
				extractObsidianPath("![Image](https://www.test.com/Name.png)")
			).toStrictEqual(undefined);
		});
		test("URL", () => {
			expect(
				extractObsidianPath("https://www.test.com/Name.png")
			).toStrictEqual(undefined);
		});
	});

	describe("isValidUrl", () => {
		describe("should be true", () => {
			test("http", () => {
				expect(isValidUrl("http://example.com")).toStrictEqual(true);
			});

			test("https", () => {
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
				expect(isValidUrl("example.com")).toStrictEqual(false);
			});

			test("string", () => {
				expect(isValidUrl("example")).toStrictEqual(false);
			});
		});
	});

	describe("normalizeAltText", () => {
		test("trim whitespace", () => {
			expect(normalizeAltText("  alt text  ")).toStrictEqual("alt text");
		});

		test("collapse multiple spaces into one", () => {
			expect(normalizeAltText("alt    text")).toStrictEqual("alt text");
		});

		test("remove line breaks and collapse to space", () => {
			expect(normalizeAltText("alt\ntext")).toStrictEqual("alt text");
		});

		test("remove multiple line breaks", () => {
			expect(normalizeAltText("alt\n\n\ntext")).toStrictEqual("alt text");
		});

		test("mixed whitespace and line breaks", () => {
			expect(
				normalizeAltText("  alt \n  text  \n with  breaks  ")
			).toStrictEqual("alt text with breaks");
		});

		test("tabs and newlines", () => {
			expect(normalizeAltText("alt\t\ntext")).toStrictEqual("alt text");
		});
	});

	describe("insertAltTextToObsidian", () => {
		describe("should insert alt text correctly", () => {
			test("simple filename", () => {
				expect(
					insertAltTextToObsidian(
						"![[Image Name.png]]",
						"extracted text"
					)
				).toStrictEqual("![[Image Name.png|extracted text]]");
			});

			test("filename with spaces", () => {
				expect(
					insertAltTextToObsidian(
						"![[My Image File.png]]",
						"some alt text"
					)
				).toStrictEqual("![[My Image File.png|some alt text]]");
			});

			test("url instead of filename", () => {
				expect(
					insertAltTextToObsidian(
						"![[https://example.com/image.png]]",
						"alt text"
					)
				).toStrictEqual("![[https://example.com/image.png|alt text]]");
			});

			test("replace existing alt text (size)", () => {
				expect(
					insertAltTextToObsidian(
						"![[Image Name.png|300]]",
						"new alt text"
					)
				).toStrictEqual("![[Image Name.png|300|new alt text]]");
			});

			test("replace existing alt text", () => {
				expect(
					insertAltTextToObsidian(
						"![[Image Name.png|old alt]]",
						"new alt text"
					)
				).toStrictEqual("![[Image Name.png|new alt text]]");
			});

			test("replace existing alt text with size preserved", () => {
				expect(
					insertAltTextToObsidian(
						"![[Image Name.png|300|old alt]]",
						"new alt text"
					)
				).toStrictEqual("![[Image Name.png|300|new alt text]]");
			});
		});

		test("external url with size", () => {
			expect(
				insertAltTextToObsidian(
					"![[https://example.com/image.png|400]]",
					"website logo"
				)
			).toStrictEqual(
				"![[https://example.com/image.png|400|website logo]]"
			);
		});

		describe("edge cases with spacing and line breaks", () => {
			describe("obsidian images with normalized alt text", () => {
				test("size without spaces (standard)", () => {
					expect(
						insertAltTextToObsidian(
							"![[Image.png|300]]",
							"alt  text"
						)
					).toStrictEqual("![[Image.png|300|alt text]]");
				});

				test("alt text with line breaks gets normalized", () => {
					expect(
						insertAltTextToObsidian(
							"![[Image.png|300]]",
							"alt\ntext\nhere"
						)
					).toStrictEqual("![[Image.png|300|alt text here]]");
				});
			});

			describe("markdown images with normalized alt text", () => {
				test("alt text with line breaks gets normalized", () => {
					expect(
						insertAltTextToMarkdown(
							"![](url.png)",
							"alt\ntext\nhere"
						)
					).toStrictEqual("![alt text here](url.png)");
				});
			});

			describe("html img tags with normalized alt text", () => {
				test("alt text with line breaks gets normalized", () => {
					expect(
						insertAltTextToHtmlImg(
							"<img src='image.png'/>",
							"alt\ntext\nhere"
						)
					).toStrictEqual(
						"<img src='image.png' alt=\"alt text here\"/>"
					);
				});
			});
		});

		describe("should handle invalid input", () => {
			test("not an obsidian tag", () => {
				expect(
					insertAltTextToObsidian("![Image](url.png)", "alt text")
				).toStrictEqual("![Image](url.png)");
			});

			test("empty selection", () => {
				expect(insertAltTextToObsidian("", "alt text")).toStrictEqual(
					""
				);
			});
		});
	});
});

describe("insertAltTextToMarkdown", () => {
	describe("should insert alt text correctly", () => {
		test("simple markdown image", () => {
			expect(
				insertAltTextToMarkdown(
					"![Image](https://example.com/image.png)",
					"extracted text"
				)
			).toStrictEqual("![extracted text](https://example.com/image.png)");
		});

		test("replace existing alt text", () => {
			expect(
				insertAltTextToMarkdown(
					"![old alt](https://example.com/image.png)",
					"new alt text"
				)
			).toStrictEqual("![new alt text](https://example.com/image.png)");
		});

		test("with local file path", () => {
			expect(
				insertAltTextToMarkdown("![Image](image.png)", "alt text here")
			).toStrictEqual("![alt text here](image.png)");
		});

		test("alt text with spaces", () => {
			expect(
				insertAltTextToMarkdown("![](url.png)", "this is alt text")
			).toStrictEqual("![this is alt text](url.png)");
		});

		test("with query parameters in url", () => {
			expect(
				insertAltTextToMarkdown(
					"![](https://example.com/image.png?size=medium)",
					"responsive image"
				)
			).toStrictEqual(
				"![responsive image](https://example.com/image.png?size=medium)"
			);
		});
	});

	describe("should handle invalid input", () => {
		test("not a markdown image", () => {
			expect(
				insertAltTextToMarkdown("![[Image.png]]", "alt text")
			).toStrictEqual("![[Image.png]]");
		});

		test("empty selection", () => {
			expect(insertAltTextToMarkdown("", "alt text")).toStrictEqual("");
		});
	});
});

describe("insertAltTextToHtmlImg", () => {
	describe("should insert alt text correctly", () => {
		test("img tag without alt", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='https://example.com/image.png'/>",
					"extracted text"
				)
			).toStrictEqual(
				"<img src='https://example.com/image.png' alt=\"extracted text\"/>"
			);
		});

		test("img tag with double quotes", () => {
			expect(
				insertAltTextToHtmlImg(
					'<img src="https://example.com/image.png"/>',
					"alt text"
				)
			).toStrictEqual(
				'<img src="https://example.com/image.png" alt="alt text"/>'
			);
		});

		test("replace existing alt text", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='image.png' alt='old alt'/>",
					"new alt text"
				)
			).toStrictEqual("<img src='image.png' alt=\"new alt text\"/>");
		});

		test("img tag with whitespace", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img   src='image.png'   />",
					"alt text"
				)
			).toStrictEqual("<img   src='image.png' alt=\"alt text\"/>");
		});

		test("img tag with additional attributes", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='image.png' style='width:200px;'/>",
					"alt"
				)
			).toStrictEqual(
				"<img src='image.png' style='width:200px;' alt=\"alt\"/>"
			);
		});

		test("img tag with existing alt (case insensitive)", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='image.png' ALT='old'/>",
					"new"
				)
			).toStrictEqual("<img src='image.png' alt=\"new\"/>");
		});

		test("img tag with width and height", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='image.png' width='200' height='150'/>",
					"resized image"
				)
			).toStrictEqual(
				"<img src='image.png' width='200' height='150' alt=\"resized image\"/>"
			);
		});

		test("img tag with style and existing alt", () => {
			expect(
				insertAltTextToHtmlImg(
					"<img src='image.png' style='margin:10px;' alt='old text'/>",
					"new description"
				)
			).toStrictEqual(
				"<img src='image.png' style='margin:10px;' alt=\"new description\"/>"
			);
		});
	});

	describe("should handle invalid input", () => {
		test("not an img tag", () => {
			expect(
				insertAltTextToHtmlImg("![image](url)", "alt")
			).toStrictEqual("![image](url)");
		});

		test("empty selection", () => {
			expect(insertAltTextToHtmlImg("", "alt text")).toStrictEqual("");
		});
	});

	describe("real world examples", () => {
		describe("obsidian images", () => {
			test("simple obsidian image", () => {
				expect(
					insertAltTextToObsidian(
						"![[Pasted image 20240220233703.png]]",
						"Example text from image"
					)
				).toStrictEqual(
					"![[Pasted image 20240220233703.png|Example text from image]]"
				);
			});

			test("obsidian image with size", () => {
				expect(
					insertAltTextToObsidian(
						"![[Pasted image 20240131205606.png|300]]",
						"Extracted content here"
					)
				).toStrictEqual(
					"![[Pasted image 20240131205606.png|300|Extracted content here]]"
				);
			});

			test("obsidian image with app protocol", () => {
				expect(
					insertAltTextToObsidian(
						"![[app:///Users/name/Downloads/img.jpg]]",
						"Stock photo description"
					)
				).toStrictEqual(
					"![[app:///Users/name/Downloads/img.jpg|Stock photo description]]"
				);
			});
		});

		describe("markdown images", () => {
			test("markdown image with long SVG URL", () => {
				expect(
					insertAltTextToMarkdown(
						"![Image](https://raw.githubusercontent.com/dario-baumberger/obsidian-image-to-text-ocr/refs/heads/master/demo/loremipsum.png)",
						"German text justification example"
					)
				).toStrictEqual(
					"![German text justification example](https://raw.githubusercontent.com/dario-baumberger/obsidian-image-to-text-ocr/refs/heads/master/demo/loremipsum.png)"
				);
			});
		});

		describe("html img tags", () => {
			test("html img tag with long SVG URL", () => {
				expect(
					insertAltTextToHtmlImg(
						'<img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Blocksatz-Beispiel_deutsch%2C_German_text_sample_with_fully_justified_text.svg" />',
						"Text justification sample"
					)
				).toStrictEqual(
					'<img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Blocksatz-Beispiel_deutsch%2C_German_text_sample_with_fully_justified_text.svg" alt="Text justification sample"/>'
				);
			});
		});
	});
});
