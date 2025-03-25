export type Libraries = ['places'];

export const googleMapsConfig = {
  mapOptions: {
    center: { lat: 51.5074, lng: -0.1278 }, // London coordinates as a default center
    zoom: 10,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    gestureHandling: 'greedy', // This enables scroll zoom without Cmd/Ctrl
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  },
};

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
  name?: string;
}

export interface RouteStop {
  id: string;
  location: MapLocation;
  notes?: string;
  duration?: number; // Duration in minutes
}

export interface RouteData {
  id?: string;
  title: string;
  description: string;
  stops: RouteStop[];
  category: string;
  duration?: number; // Total duration in minutes
  distance?: number; // Distance in meters
  directions?: google.maps.DirectionsResult;
}

export const defaultMapCenter = {
  lat: 51.5074,
  lng: -0.1278
}; 