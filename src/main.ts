import {Editor, FileSystemAdapter, Notice, Plugin} from "obsidian";
import {ImageToTextOcrPluginSettingTab} from "./settings";
import {checkFileType, checkFormat, getText} from "./functions";
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
			id: "image-to-text-replace",
			name: "Image To Text: Replace Selection",
			icon: "table",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const imagePath = await this.getSelectedImagePath(selection);

				if (imagePath && checkFileType(imagePath)) {
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
							console.log(this.settings.language);
							console.log(result);
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
			id: "image-to-text-replace-select-language",
			name: "Image To Text: Replace Selection - custom language",
			icon: "table",
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
									console.log(this.settings.language);
									console.log(result);
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
			id: "image-to-text-append",
			name: "Image To Text: Append Selection",
			icon: "table",
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
							console.log(this.settings.language);
							console.log(result);
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
			id: "image-to-text-append-select-language",
			name: "Image To Text: Append Selection - custom language",
			icon: "table",
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
									console.log(this.settings.language);
									console.log(result);
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
		const files = this.app.vault.getFiles();
		const imageFile = files.find((file) => file.name === imageFilename);

		if (imageFile) {
			const adapter = this.app.vault.adapter;
			if (adapter instanceof FileSystemAdapter) {
				const resourcePath = adapter.getResourcePath(imageFile.path);
				if (this.settings.devMode) {
					console.log(resourcePath);
				}
				return resourcePath;
			} else {
				new Notice("Error resolving adapter", 0);
				throw new Error("Error resolving adapter");
			}
		} else {
			new Notice("Image file not found in the vault.", 0);
			throw new Error("Image file not found in the vault.");
		}
	}

	async getSelectedImagePath(selection: string): Promise<string> {
		if (this.settings.devMode) {
			console.log(selection);
		}

		const imageFilename = checkFormat(selection);

		if (imageFilename) {
			const fullPath = await this.resolveImagePath(imageFilename);

			if (fullPath && checkFileType(fullPath)) {
				return fullPath;
			} else {
				new Notice("Could not resolve image path", 0);
				throw new Error("Could not resolve image path");
			}
		} else {
			new Notice(
				"Wrong format or not supported file type. Allowed file types: .jpg, .jpeg, .png, .gif, .bmp, .pbm, .webp",
				0
			);
			throw new Error(
				"Wrong format or not supported file type. Allowed file types: .jpg, .jpeg, .png, .gif, .bmp, .pbm, .webp"
			);
		}
	}
}
