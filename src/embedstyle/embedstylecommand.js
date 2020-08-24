import Command from '@ckeditor/ckeditor5-core/src/command';
import { isEmbed } from './utils';

/**
 * The image style command. It is used to apply different image styles.
*/
export default class EmbedStyleCommand extends Command {
	constructor( editor, styles ) {
		super( editor );
		this.defaultStyle = false;
		this.styles = styles.reduce( ( styles, style ) => {
			styles[ style.name ] = style;

			if ( style.isDefault ) {
				this.defaultStyle = style.name;
			}

			return styles;
		}, {} );
	}

	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();
		this.isEnabled = isEmbed( element );

		console.log("embed element refresh ---> ", element)

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'embedStyle' ) ) {
			const attributeValue = element.getAttribute( 'embedStyle' );
			this.value = this.styles[ attributeValue ] ? attributeValue : false;
		} else {
			this.value = this.defaultStyle;
		}
	}

	execute( options ) {
		const styleName = options.value;

		const model = this.editor.model;
		const embedElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			if ( this.styles[ styleName ].isDefault ) {
				writer.removeAttribute( 'embedStyle', embedElement );
			} else {
				writer.setAttribute( 'embedStyle', styleName, embedElement );
			}
		} );
	}
}
