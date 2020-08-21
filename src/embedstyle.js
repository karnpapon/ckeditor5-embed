import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import EmbedStyleEditing from './embedstyle/embedstyleediting';
import EmbedStyleUI from './embedstyle/embedstyleui';

export default class EmbedStyle extends Plugin {
	static get requires() {
		return [ EmbedStyleEditing, EmbedStyleUI ];
	}

	static get pluginName() {
		return 'EmbedStyle';
	}
}
