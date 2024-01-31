import {App, PluginSettingTab, Setting} from "obsidian";
import ImageToTextOcrPlugin from "src/main";
import {languages} from "./languages";

export class ImageToTextOcrPluginSettingTab extends PluginSettingTab {
	plugin: ImageToTextOcrPlugin;

	constructor(app: App, plugin: ImageToTextOcrPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Language Settings - default for text recognition
		new Setting(containerEl)
			.setName("Content language")
			.setDesc("Select language to recognize")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(languages)
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
					})
			);

		// DeMode Settings - to enforce logging
		new Setting(containerEl)
			.setName("Enable debug logging")
			.setDesc("If enabled, more will be logged in the console.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.devMode)
					.onChange(async (value) => {
						this.plugin.settings.devMode = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
