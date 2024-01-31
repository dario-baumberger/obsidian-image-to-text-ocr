import { App, SuggestModal } from "obsidian";

interface Language {
	code: string;
	name: string;
}

export class LanguageModal extends SuggestModal<Language> {
	constructor(
		app: App,
		placeholder: string,
		public languages: Language[],
		public callback: (result: Language) => void
	) {
		super(app);
		this.setPlaceholder(placeholder);
		console.log(placeholder, languages);
	}

	getSuggestions(query: string): Language[] {
		if (query) {
			return this.languages.filter(
				(language) =>
					language.code.toLowerCase().includes(query.toLowerCase()) ||
					language.name.toLowerCase().includes(query.toLowerCase())
			);
		}

		return this.languages;
	}
	renderSuggestion(language: Language, el: HTMLElement) {
		console.log("render sug");
		el.createEl("div", { text: `${language.name} (${language.code})` });
	}
	onChooseSuggestion(language: Language) {
		this.callback(language);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
