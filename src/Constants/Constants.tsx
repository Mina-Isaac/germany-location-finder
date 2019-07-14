export interface LatLng {
  lat: number;
  lng: number;
};
export interface CountryBounds {
    east: number;
    north: number;
    south: number;
    west: number;
}
export interface IMAPCONFIG {
  SERVER_URL: string;
  GOOGLE_API_KEY: string;
  DEFAULT_CENTER: LatLng;
  ACTIVE_MARKER_ICON: string;
  COUNTRY_CODE: string;
  DEFAULT_MARKER_ID: string;
  DEFAULT_BOUNDS_RESTRICTIONS: {
    latLngBounds: CountryBounds;
    strictBounds: boolean;
  };
}
export const MAP_CONFIG: IMAPCONFIG = {
  SERVER_URL: 'http://localhost:3001/',
  GOOGLE_API_KEY: 'Your Google API Key goes here',
  DEFAULT_CENTER: { lat: 51.165691, lng: 10.451526 }, // Center of Germany comes from geocoder service for Germany
  ACTIVE_MARKER_ICON: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  COUNTRY_CODE: 'DE',
  DEFAULT_MARKER_ID: 'NEW_MARKER',
  DEFAULT_BOUNDS_RESTRICTIONS: {
    latLngBounds: {
      east: 15.0418962, // Germany east boundary
      north: 55.0815, // Germany north boundary
      south: 47.2701115, // Germany south boundary
      west: 5.8663425 // Germany west boundary 5.8663425 + margin for panel widget
    },
    strictBounds: true
  }
};
