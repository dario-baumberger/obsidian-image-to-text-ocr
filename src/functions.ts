import {createWorker} from "tesseract.js";

const MD_TAG = /!\[.*?\]\((.*?)\)/;
const OBSIDIAN_TAG = /!\[\[(.*?)\]\]/;
const IMG_TAG = /<img([\w\W]+?)\/>/;

export async function getText(
	imagePath: string,
	language = "eng"
): Promise<string> {
	try {
		const worker = await createWorker(language);
		const result = await worker.recognize(imagePath);
		await worker.terminate();

		return result.data.text;
	} catch (e) {
		throw new Error(e);
	}
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

export function isImgTag(string: string): boolean {
	const pattern = IMG_TAG;

	return pattern.test(string);
}

export function extractSrc(selection: string): string | undefined {
	const match = selection.match(/src\s*=\s*['"](.+?)['"]/);

	return match && match[1] ? match[1] : undefined;
}

export function extractMdPath(selection: string): string | undefined {
	const match = selection.match(MD_TAG);

	return match && match[1] ? match[1] : undefined;
}

export function extractObsidianPath(selection: string): string | undefined {
	const match = selection.match(OBSIDIAN_TAG);

	return match && match[1] ? match[1].split("|")[0] : undefined;
}

export function checkFileType(filePath: string): boolean {
	const imageRegex = /\.(jpg|jpeg|png|gif|bmp|pbm|webp)$/i;
	return imageRegex.test(filePath);
}
