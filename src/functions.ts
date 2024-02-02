import {createWorker} from "tesseract.js";

const MD_TAG = /!\[.*?\]\((.*?)\)/;
const OBSIDIAN_TAG = /!\[\[(.*?)\]\]/;

export async function getText(
	imagePath: string,
	language = "eng"
): Promise<string> {
	const worker = await createWorker(language);
	const ret = await worker.recognize(imagePath);
	await worker.terminate();

	return ret.data.text;
}

export function isValidUrl(url: string): boolean {
	const pattern = new RegExp(
		"^(https?:\\/\\/)([\\w.-]+)(:\\d+)?(\\/[\\w#!:.?+=&%@!-/]*)?$",
		"i"
	);

	return pattern.test(url);
}

export function isObsidianTag(string: string): boolean {
	const pattern = OBSIDIAN_TAG;

	return pattern.test(string);
}

export function isMarkdownTag(string: string): boolean {
	const pattern = MD_TAG;

	return pattern.test(string);
}

export function extractPath(selection: string): string | undefined {
	const obsidianImageRegex = OBSIDIAN_TAG;
	const markdownImageRegex = MD_TAG;
	const match =
		obsidianImageRegex.exec(selection) ||
		markdownImageRegex.exec(selection);

	if (match && match[1]) {
		return match[1];
	}

	return undefined;
}

export function checkFileType(filePath: string): boolean {
	const imageRegex = /\.(jpg|jpeg|png|gif|bmp|pbm|webp)$/i;
	return imageRegex.test(filePath);
}
