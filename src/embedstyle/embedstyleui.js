import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { normalizeEmbedStyles } from './utils';

import '../../theme/embedstyle.css';

export default class EmbedStyleUI extends Plugin {
	static get pluginName() {
		return 'EmbedStyleUI';
	}

	get localizedDefaultStylesTitles() {
		const t = this.editor.t;

		return {
			'Full size embed': t( 'Full size embed' ),
			'Side embed': t( 'Side embed' ),
			'Left aligned embed': t( 'Left aligned embed' ),
			'Centered embed': t( 'Centered embed' ),
			'Right aligned embed': t( 'Right aligned embed' )
		};
	}

	init() {
		const editor = this.editor;
		const configuredStyles = editor.config.get( 'embed.styles' );

		const translatedStyles = translateStyles( normalizeEmbedStyles( configuredStyles ), this.localizedDefaultStylesTitles );

		for ( const style of translatedStyles ) {
			this._createButton( style );
		}
	}

	_createButton( style ) {
		const editor = this.editor;

		const componentName = `embedstyle:${ style.name }`;

		editor.ui.componentFactory.add( componentName, locale => {
			const command = editor.commands.get( 'embedstyle' );
			const view = new ButtonView( locale );

			view.set( {
				label: style.title,
				icon: style.icon,
				tooltip: true,
				isToggleable: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			view.bind( 'isOn' ).to( command, 'value', value => value === style.name );

			this.listenTo( view, 'execute', () => {
				editor.execute( 'embedstyle', { value: style.name } );
				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}

function translateStyles( styles, titles ) {
	for ( const style of styles ) {
		if ( titles[ style.title ] ) {
			style.title = titles[ style.title ];
		}
	}

	return styles;
}
