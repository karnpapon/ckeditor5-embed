import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';
import leftSideIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left-side.svg';
import { attachLinkToDocumentation } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';


const defaultStyles = {
	// This option is equal to the situation when no style is applied.
	full: {
		name: 'full',
		title: 'Full size embed',
		icon: fullWidthIcon,
		isDefault: true
	},

	// This represents a side embed.
	side: {
		name: 'side',
		title: 'Side embed',
		icon: leftSideIcon,
		className: 'embed-style-side'
	},

	// This style represents an embed aligned to the left.
	alignLeft: {
		name: 'alignLeft',
		title: 'Left aligned embed',
		icon: leftIcon,
		className: 'embed-style-align-left'
	},

	// This style represents a centered embed.
	alignCenter: {
		name: 'alignCenter',
		title: 'Centered embed',
		icon: centerIcon,
		className: 'embed-style-align-center'
	},

	// This style represents an embed aligned to the right.
	alignRight: {
		name: 'alignRight',
		title: 'Right aligned embed',
		icon: rightIcon,
		className: 'embed-style-align-right'
	}
};

const defaultIcons = {
	full: fullWidthIcon,
	left: leftIcon,
	right: rightIcon,
	center: centerIcon
};

export function normalizeEmbedStyles( configuredStyles = [] ) {
	return configuredStyles.map( _normalizeStyle );
}

export function isEmbed(modelElement) {
	return !!modelElement && modelElement.is("embed");
  }

function _normalizeStyle( style ) {
	// Just the name of the style has been passed.
	console.log("style ------> ", style) 
	if ( typeof style == 'string' ) {
		const styleName = style;

		// If it's one of the defaults, just use it.
		if ( defaultStyles[ styleName ] ) {
			// Clone the style to avoid overriding defaults.
			style = Object.assign( {}, defaultStyles[ styleName ] );
		}
		// If it's just a name but none of the defaults, warn because probably it's a mistake.
		else {
			console.warn(
				attachLinkToDocumentation( 'embed-style-not-found: There is no such embed style of given name.' ),
				{ name: styleName }
			);

			// Normalize the style anyway to prevent errors.
			style = {
				name: styleName
			};
		}
	}
	// If an object style has been passed and if the name matches one of the defaults,
	// extend it with defaults – the user wants to customize a default style.
	// Note: Don't override the user–defined style object, clone it instead.
	else if ( defaultStyles[ style.name ] ) {
		const defaultStyle = defaultStyles[ style.name ];
		const extendedStyle = Object.assign( {}, style );

		for ( const prop in defaultStyle ) {
			if ( !style.hasOwnProperty( prop ) ) {
				extendedStyle[ prop ] = defaultStyle[ prop ];
			}
		}

		style = extendedStyle;
	}

	// If an icon is defined as a string and correspond with a name
	// in default icons, use the default icon provided by the plugin.
	if ( typeof style.icon == 'string' && defaultIcons[ style.icon ] ) {
		style.icon = defaultIcons[ style.icon ];
	}

	return style;
}
