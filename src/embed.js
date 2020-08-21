/**
 * @module embed/embed
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import EmbedEditing from './embedediting';
import EmbedUI from './embedui';

/**
 * The embed plugin. It introduces the embed buttons and the <kbd>Ctrl+Shift+K</kbd> keystroke.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Embed extends Plugin {

	static get requires() {
		return [ EmbedEditing, EmbedUI, Widget ];
	}


	static get pluginName() {
		return 'Embed';
	}
}
