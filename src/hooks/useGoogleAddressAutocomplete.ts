
import { useRef, useCallback } from 'react';

export const useGoogleAddressAutocomplete = (
    onAddressSelect: (address: string) => void
) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
        autocomplete.setOptions({
            types: ['establishment', 'geocode'],
            fields: ['formatted_address', 'name', 'place_id', 'geometry'],
        });
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            let addressText = '';
            if (place.name && place.formatted_address) {
                // If it's a specific place (business), format as "Name, Address"
                // Checking if the name is contained in the address to avoid redundancy 
                // (though Google often handles this, manual checks are safe)
                if (place.formatted_address.includes(place.name)) {
                    addressText = place.formatted_address;
                } else {
                    addressText = `${place.name}, ${place.formatted_address}`;
                }
            } else if (place.formatted_address) {
                addressText = place.formatted_address;
            } else if (place.name) {
                addressText = place.name;
            }

            if (addressText) {
                onAddressSelect(addressText);
            }
        }
    }, [onAddressSelect]);

    return {
        onLoad,
        onPlaceChanged,
        autocompleteRef
    };
};
