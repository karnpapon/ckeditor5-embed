/**
 * @module embed/embedediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import EmbedCommand from './embedcommand';
import { getViewElementAttributes } from './utils.js';
/**
 * The embed engine feature.
 * @extends module:core/plugin~Plugin
 */
export default class EmbedEditing extends Plugin {

	init() {
		const editor = this.editor;
		const embed_options = editor.config.get( 'embed' );
		const t = editor.t;
		let allowed_attributes = [ 'width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen' ];
		allowed_attributes = embed_options&&Array.isArray(embed_options.allowAttributes)&&embed_options.allowAttributes.length?
		allowed_attributes.concat(embed_options.allowAttributes.filter(item => allowed_attributes.indexOf(item) === -1)):allowed_attributes;


		editor.model.schema.register( 'embed', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowIn: '$block',
			allowAttributes: allowed_attributes
		} );

		editor.conversion.elementToElement( {
			model: 'embed',
			view: ( modelElement, viewWriter ) => {
				if( viewWriter ){
					const figure = viewWriter.createContainerElement( 'figure', { class: 'media', style: 'padding-bottom:56%;position:relative;' } );
					const iframeElement = viewWriter.createEmptyElement( 'iframe', modelElement.getAttributes() );
					const label = t( 'media widget' );
					viewWriter.insert( viewWriter.createPositionAt( figure, 0 ), iframeElement );
					return toWidget( figure, viewWriter, { label } );
				}return '';
			}
		} ) ;

		editor.conversion.for( 'upcast' ).elementToElement( {
				view: 'iframe',
		    model: ( viewElement, modelWriter ) => {
		        return modelWriter.createElement( 'embed', getViewElementAttributes(viewElement) );
		    }
		} );

		// Create embeding commands.
		editor.commands.add( 'embed', new EmbedCommand( editor ) );

	}

}
