import {createWorker} from "tesseract.js";

const MD_TAG = /!\[.*?\]\((.*?)\)/;
const OBSIDIAN_TAG = /!\[\[(.*?)\]\]/;
const IMG_TAG = /<img([\w\W]+?)\/>/;
const ALLOWED_IMG_TYPES = /\.(jpg|jpeg|png|gif|bmp|pbm|webp)$/i;

/**
 * recognize and return text on images
 */
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

/**
 * check if is a valid url
 */
export function isValidUrl(url: string): boolean {
	const pattern = new RegExp(
		"^(https?:\\/\\/)([\\w.-]+)(:\\d+)?(\\/[\\w#!:.?+=&%@!-/]*)?$",
		"i"
	);

	return pattern.test(url);
}

/**
 * check if string is a obsidian image tag
 */
export function isObsidianTag(string: string): boolean {
	return OBSIDIAN_TAG.test(string);
}

/**
 * Check if string is a markdown tag
 */
export function isMarkdownTag(string: string): boolean {
	return MD_TAG.test(string);
}

/**
 * Check if string is an image tag
 */
export function isImgTag(string: string): boolean {
	return IMG_TAG.test(string);
}

/**
 * get value from src attribute from images
 */
export function extractSrc(selection: string): string | undefined {
	const match = selection.match(/src\s*=\s*['"](.+?)['"]/);

	return match && match[1] ? match[1] : undefined;
}

/**
 * get path from markdown markup
 */
export function extractMdPath(selection: string): string | undefined {
	const match = selection.match(MD_TAG);

	return match && match[1] ? match[1] : undefined;
}

/**
 * get path from obsidian markup
 * get only file name of also have defined size
 */
export function extractObsidianPath(selection: string): string | undefined {
	const match = selection.match(OBSIDIAN_TAG);

	return match && match[1] ? match[1].split("|")[0] : undefined;
}

/**
 * check if file is allowed.
 * checky only based on file ending, not on it's content
 */
export function checkFileType(filePath: string): boolean {
	return ALLOWED_IMG_TYPES.test(filePath);
}
