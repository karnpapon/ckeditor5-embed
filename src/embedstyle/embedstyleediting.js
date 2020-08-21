import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import EmbedStyleCommand from './embedstylecommand';
import { viewToModelStyleAttribute, modelToViewStyleAttribute } from './converters';
import { normalizeEmbedStyles } from './utils';

export default class EmbedStyleEditing extends Plugin {
	static get pluginName() {
		return 'EmbedStyleEditing';
	}

	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Define default configuration.
		editor.config.define( 'embed.styles', [ 'full', 'side' ] );

		// Get configuration.
		const styles = normalizeEmbedStyles( editor.config.get( 'embed.styles' ) );

		// Allow imaseStyle attribute in image.
		// We could call it 'style' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'embed', { allowAttributes: 'embedStyle' } );

		const modelToViewConverter = modelToViewStyleAttribute( styles );
		editing.downcastDispatcher.on( 'attribute:embedStyle:embed', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:embedStyle:embed', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:figure', viewToModelStyleAttribute( styles ), { priority: 'low' } );

		// Register imageStyle command.
		editor.commands.add( 'embedStyle', new EmbedStyleCommand( editor, styles ) );
	}
}

