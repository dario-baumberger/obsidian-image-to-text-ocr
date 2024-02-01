import {createWorker} from "tesseract.js";

export async function getText(
	imagePath: string,
	language = "eng"
): Promise<string> {
	const worker = await createWorker(language);
	const ret = await worker.recognize(imagePath);
	await worker.terminate();

	return ret.data.text;
}

export function checkFormat(selection: string): string | undefined {
	const obsidianImageRegex = /!\[\[(.*?)\]\]/;
	const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
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
