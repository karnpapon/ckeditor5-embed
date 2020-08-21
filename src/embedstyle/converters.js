import first from '@ckeditor/ckeditor5-utils/src/first';

export function modelToViewStyleAttribute( styles ) {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		// Check if there is class name associated with given value.
		const newStyle = getStyleByName( data.attributeNewValue, styles );
		const oldStyle = getStyleByName( data.attributeOldValue, styles );

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;

		if ( oldStyle ) {
			viewWriter.removeClass( oldStyle.className, viewElement );
		}

		if ( newStyle ) {
			viewWriter.addClass( newStyle.className, viewElement );
		}
	};
}

/**
 * Returns a view-to-model converter converting image CSS classes to a proper value in the model.
 */
export function viewToModelStyleAttribute( styles ) {
	// Convert only non–default styles.
	const filteredStyles = styles.filter( style => !style.isDefault );

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewFigureElement = data.viewItem;
		const modelImageElement = first( data.modelRange.getItems() );

		// Check if `imageStyle` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelImageElement, 'embedStyle' ) ) {
			return;
		}

		// Convert style one by one.
		for ( const style of filteredStyles ) {
			// Try to consume class corresponding with style.
			if ( conversionApi.consumable.consume( viewFigureElement, { classes: style.className } ) ) {
				// And convert this style to model attribute.
				conversionApi.writer.setAttribute( 'embedStyle', style.name, modelImageElement );
			}
		}
	};
}

// Returns the style with a given `name` from an array of styles.
function getStyleByName( name, styles ) {
	for ( const style of styles ) {
		if ( style.name === name ) {
			return style;
		}
	}
}
