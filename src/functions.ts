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

		return result.data.text
			.trim()
			.replace(/\n+/g, " ")
			.replace(/\s+/g, " ");
	} catch (e) {
		const errorMessage = String(e);
		if (
			errorMessage.includes("CORS") ||
			errorMessage.includes("Failed to fetch")
		) {
			throw new Error(
				"Cannot access this image. The server blocked the request (CORS policy). Try using a local image or an image from a different source."
			);
		}
		throw new Error(errorMessage);
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
 * Normalize alt text by removing line breaks and collapsing whitespace
 */
export function normalizeAltText(altText: string): string {
	return altText.trim().replace(/\n+/g, " ").replace(/\s+/g, " ");
}

/**
 * check if file is allowed.
 * checky only based on file ending, not on it's content
 */
export function checkFileType(filePath: string): boolean {
	return ALLOWED_IMG_TYPES.test(filePath);
}

/**
 * Insert alt text into obsidian image tag
 * Converts ![[file.png]] to ![[file.png|alt text]]
 * Preserves size: ![[file.png|300]] to ![[file.png|300|alt text]]
 * Replaces existing alt text while preserving size
 */
export function insertAltTextToObsidian(
	selection: string,
	altText: string
): string {
	const match = selection.match(OBSIDIAN_TAG);
	if (!match || !match[1]) {
		return selection;
	}

	const content = match[1];
	const parts = content.split("|");
	const fileName = parts[0];

	// Check if there's a size parameter (numeric value)
	const size = parts.length > 1 && /^\d+/.test(parts[1]) ? parts[1] : null;
	const normalizedAltText = normalizeAltText(altText);

	// Reconstruct with size preserved if it exists
	if (size) {
		return `![[${fileName}|${size}|${normalizedAltText}]]`;
	}

	return `![[${fileName}|${normalizedAltText}]]`;
}

/**
 * Insert alt text into markdown image tag
 * Converts ![alt](url) to ![altText](url)
 */
export function insertAltTextToMarkdown(
	selection: string,
	altText: string
): string {
	const match = selection.match(MD_TAG);
	if (!match || !match[1]) {
		return selection;
	}

	const imagePath = match[1];
	const normalizedAltText = normalizeAltText(altText);
	return `![${normalizedAltText}](${imagePath})`;
}

/**
 * Insert alt text into HTML img tag
 * Converts <img src="url"/> to <img src="url" alt="altText"/>
 * or updates existing alt attribute
 */
export function insertAltTextToHtmlImg(
	selection: string,
	altText: string
): string {
	// Remove existing alt attribute if present
	let result = selection.replace(/\s+alt\s*=\s*['"][^'"]*['"]/i, "");
	const normalizedAltText = normalizeAltText(altText);

	// Insert alt attribute before closing />
	result = result.replace(/\s*\/>$/, ` alt="${normalizedAltText}"/>`);

	return result;
}
