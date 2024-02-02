import {Editor, FileSystemAdapter, Notice, Plugin, TFile} from "obsidian";
import {ImageToTextOcrPluginSettingTab} from "./settings";
import {
	checkFileType,
	extractMdPath,
	extractObsidianPath,
	extractSrc,
	getText,
	isImgTag,
	isMarkdownTag,
	isObsidianTag,
	isValidUrl
} from "./functions";
import {LanguageModal} from "./modal";
import {languages} from "./languages";

interface ImageToTextOcrPluginSettings {
	devMode: boolean;
	language: string;
}

const DEFAULT_SETTINGS: ImageToTextOcrPluginSettings = {
	devMode: false,
	language: "eng"
};

export default class ImageToTextOcrPlugin extends Plugin {
	settings: ImageToTextOcrPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "replace",
			name: "Image To Text: Replace Selection",
			icon: "image-minus",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const imagePath = await this.getSelectedImagePath(selection);

				if (imagePath) {
					try {
						const loadingNotice = new Notice(
							"Recoginition is running...",
							0
						);

						const result = await getText(
							imagePath,
							this.settings.language
						);

						if (this.settings.devMode) {
							console.log(
								`this.settings.language: ${this.settings.language}`
							);
							console.log(`result: ${result}`);
						}

						loadingNotice.hide();

						editor.replaceSelection(result);
					} catch (error) {
						console.error(error);
						new Notice(error);
					}
				}
			}
		});

		this.addCommand({
			id: "replace-select-language",
			name: "Image To Text: Replace Selection - custom language",
			icon: "image-minus",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const imagePath = await this.getSelectedImagePath(selection);
				if (imagePath) {
					try {
						new LanguageModal(
							this.app,
							"Text Language",
							Object.entries(languages).map(([code, name]) => ({
								code,
								name
							})),
							async (language) => {
								const loadingNotice = new Notice(
									"Recoginition is running...",
									0
								);

								const result = await getText(
									imagePath,
									language.code
								);

								if (this.settings.devMode) {
									console.log(
										`this.settings.language: ${this.settings.language}`
									);
									console.log(`result: ${result}`);
								}

								loadingNotice.hide();

								editor.replaceSelection(result);
							}
						).open();
					} catch (error) {
						console.error(error);
						new Notice(error);
					}
				}
			}
		});

		this.addCommand({
			id: "append",
			name: "Image To Text: Append Selection",
			icon: "image-plus",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const imagePath = await this.getSelectedImagePath(selection);
				if (imagePath) {
					try {
						const loadingNotice = new Notice(
							"Recoginition is running...",
							0
						);

						const result = await getText(
							imagePath,
							this.settings.language
						);

						if (this.settings.devMode) {
							console.log(
								`this.settings.language: ${this.settings.language}`
							);
							console.log(`result: ${result}`);
						}

						loadingNotice.hide();

						editor.replaceSelection(`${selection}${result}`);
					} catch (error) {
						console.error(error);
						new Notice(error);
					}
				}
			}
		});

		this.addCommand({
			id: "append-select-language",
			name: "Image To Text: Append Selection - custom language",
			icon: "image-plus",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const imagePath = await this.getSelectedImagePath(selection);
				if (imagePath) {
					try {
						new LanguageModal(
							this.app,
							"Text Language",
							Object.entries(languages).map(([code, name]) => ({
								code,
								name
							})),
							async (language) => {
								const loadingNotice = new Notice(
									"Recoginition is running...",
									0
								);
								const result = await getText(
									imagePath,
									language.code
								);

								if (this.settings.devMode) {
									console.log(
										`this.settings.language: ${this.settings.language}`
									);
									console.log(`result: ${result}`);
								}

								loadingNotice.hide();

								editor.replaceSelection(
									`${selection}${result}`
								);
							}
						).open();
					} catch (error) {
						console.error(error);
						new Notice(error);
					}
				}
			}
		});

		this.addSettingTab(new ImageToTextOcrPluginSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async resolveImagePath(imageFilename: string): Promise<string> {
		// todo avoid getFiles
		const files = this.app.vault.getFiles();
		const imageFile = files.find((file) => file.name === imageFilename);

		if (!imageFile) {
			new Notice("Image file not found in the vault.", 0);
			throw new Error("Image file not found in the vault.");
		}

		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			const resourcePath = adapter.getResourcePath(imageFile.path);
			if (this.settings.devMode) {
				console.log(`resourcePath: ${resourcePath}`);
			}
			return resourcePath;
		} else {
			new Notice("Error resolving adapter", 0);
			throw new Error("Error resolving adapter");
		}
	}

	async getSelectedImagePath(selection: string): Promise<string> {
		let imageFilename!: string | undefined;
		let fullPath!: string | undefined;

		if (this.settings.devMode) {
			console.log(`selection: ${selection}`);
		}

		if (isObsidianTag(selection)) {
			imageFilename = extractObsidianPath(selection);
			fullPath = imageFilename
				? await this.resolveImagePath(imageFilename)
				: undefined;
		} else if (isValidUrl(selection)) {
			imageFilename = selection;
			fullPath = selection;
		} else if (isImgTag(selection)) {
			imageFilename = extractSrc(selection);
			fullPath = imageFilename;
		} else if (isMarkdownTag(selection)) {
			imageFilename = extractMdPath(selection);
			fullPath =
				imageFilename && isValidUrl(imageFilename)
					? imageFilename
					: undefined;
		}

		if (this.settings.devMode) {
			console.log(`imageFilename: ${imageFilename}`);
			console.log(`fullPath: ${fullPath}`);
		}

		if (!imageFilename) {
			new Notice(
				"Not supported selection. Allowed: Obsidian Images, Markdown Images and Urls",
				0
			);
			throw new Error(
				"Not supported selection. Allowed: Obsidian Images, Markdown Images and Urls"
			);
		}

		if (!checkFileType(imageFilename)) {
			new Notice(
				"Not supported file type. Allowed file types: .jpg, .jpeg, .png, .gif, .bmp, .pbm, .webp",
				0
			);
			throw new Error(
				"Not supported file type. Allowed file types: .jpg, .jpeg, .png, .gif, .bmp, .pbm, .webp"
			);
		}

		if (!fullPath) {
			new Notice("Could not resolve image path", 0);
			throw new Error("Could not resolve image path");
		}

		return fullPath;
	}
}
