'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, InfoWindow, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapLocation, RouteStop, RouteData } from '@/config/googleMapsConfig';
import { MapPin, GripVertical, X, Clock, Plus, Loader2, Camera, Save, Eye, CheckCircle, Lock, Star, Phone, Globe } from 'lucide-react';
import { useRouteStore } from '@/stores/routeStore';
import { nanoid } from 'nanoid';
import { routeService } from '@/services/routeService';
import { createClient } from '@/utils/supabase';
import CustomRouteEditor from './CustomRouteEditor';

// Styled components
const Container = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
  background-color: #111827;
  color: #E5E7EB;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 400px;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: #1F2937;
  color: #E5E7EB;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.3);
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
`;

const SidebarContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #374151;
  background-color: #1F2937;
  flex-shrink: 0;
`;

const StopItem = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.$isDragging ? '#2D3748' : '#1F2937'};
  border-bottom: 1px solid #374151;
  box-shadow: ${props => props.$isDragging ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'};
  transform-origin: 0 0;
  cursor: pointer;
  gap: 12px;
  
  &:hover {
    background-color: #2D3748;
  }
`;

const EmptyStop = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #374151;
  color: #9CA3AF;
  gap: 12px;
  opacity: 0.5;
`;

const EmptyDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px dashed #4B5563;
  margin: 0 8px;
`;

const EmptyContent = styled.div`
  flex: 1;
  height: 40px;
  background: #374151;
  border-radius: 4px;
`;

const MapContainer = styled.div`
  flex: 1;
  height: calc(100vh - 64px);
  position: relative;
`;

const SearchOverlay = styled.div`
  position: absolute;
  top: 32px;
  left: 13%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 99;
  pointer-events: none;
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  pointer-events: auto;
  border: 1px solid #e5e7eb;
  
  .search-input-container {
    display: flex;
    align-items: center;
    background: white;
    padding: 8px 12px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
    color: #111827;
    &::placeholder {
      color: #9CA3AF;
    }
  }
`;

const StopHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  gap: 0.5rem;
`;

const StopDetails = styled.div`
  padding: 0.75rem;
  border-top: 1px solid #4B5563;
`;

const LocationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const RouteOptions = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 1000;
  background: rgba(31, 41, 55, 0.95);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
`;

const RouteOption = styled.button<{ $isSelected?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.$isSelected ? '#4CAF50' : '#1F2937'};
  color: ${props => props.$isSelected ? 'white' : '#E5E7EB'};
  border: 2px solid ${props => props.$isSelected ? '#4CAF50' : '#374151'};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$isSelected ? '#45a049' : '#2D3748'};
    border-color: ${props => props.$isSelected ? '#45a049' : '#4CAF50'};
  }
`;

// Styled component for place preview modal
const PlacePreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: #1F2937;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #374151;
`;

const ModalBody = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const PlaceImage = styled.div<{ $imageUrl?: string }>`
  height: 200px;
  background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: ${props => props.$imageUrl ? 'transparent' : '#374151'};
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// UI components for customization mode
const CustomizationOverlay = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(31, 41, 55, 0.9);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #4F46E5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 300px;
`;

// Styles for editable waypoints
const WaypointIndicator = styled.div<{ $isModified?: boolean }>`
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: ${props => props.$isModified ? '#F59E0B' : '#4F46E5'};
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    width: 16px;
    height: 16px;
    background-color: ${props => props.$isModified ? '#F97316' : '#6366F1'};
    box-shadow: 0 0 8px rgba(79, 70, 229, 0.8);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

// Create visual indicators for route status
const RouteStatusIndicator = styled.div<{ $modified: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: ${props => props.$modified ? 'rgba(239, 68, 68, 0.2)' : 'rgba(52, 211, 153, 0.2)'};
  border-left: 3px solid ${props => props.$modified ? '#EF4444' : '#34D399'};
  border-radius: 4px;
  margin-top: 8px;
  margin-bottom: 12px;
`;

// Place details interface
interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  photos?: google.maps.places.PlacePhoto[];
  geometry?: google.maps.places.PlaceGeometry;
  opening_hours?: {
    isOpen: () => boolean;
  };
}

// Create a component for the place preview modal
const PlacePreviewModalComponent = ({ 
  place, 
  onClose, 
  onAddToRoute 
}: { 
  place: google.maps.places.PlaceResult, 
  onClose: () => void, 
  onAddToRoute: () => void 
}) => {
  const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!window.google || !place.place_id) {
        setLoading(false);
        return;
      }

      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      placesService.getDetails(
        {
          placeId: place.place_id,
          fields: [
            'name',
            'formatted_address',
            'rating',
            'formatted_phone_number',
            'photos',
            'opening_hours',
            'website',
            'types',
            'url',
            'reviews',
            'price_level',
          ],
        },
        (result, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
            setPlaceDetails(result);
            
            // Get photo URL if available
            if (result.photos && result.photos.length > 0) {
              setPhotoUrl(result.photos[0].getUrl({ maxWidth: 500, maxHeight: 300 }));
            }
          }
          setLoading(false);
        }
      );
    };

    fetchPlaceDetails();
  }, [place.place_id]);

  // Function to format place type for display
  const formatPlaceType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get the first relevant type for display
  const getDisplayType = (types: string[] | undefined) => {
    if (!types || types.length === 0) return 'Place';
    
    // Filter out generic types
    const relevantTypes = types.filter(
      type => !['point_of_interest', 'establishment', 'premise', 'political'].includes(type)
    );
    
    return relevantTypes.length > 0 
      ? formatPlaceType(relevantTypes[0]) 
      : formatPlaceType(types[0]);
  };

  // Check if the place is currently open
  const isPlaceOpen = () => {
    if (!placeDetails?.opening_hours || typeof placeDetails.opening_hours.isOpen !== 'function') {
      return null;
    }
    return placeDetails.opening_hours.isOpen();
  };

  return (
    <PlacePreviewModal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <PlaceImage $imageUrl={photoUrl}>
          {!photoUrl && !loading && (
            <Camera size={48} className="text-gray-400" />
          )}
          {loading && (
            <Loader2 size={48} className="text-gray-400 animate-spin" />
          )}
        </PlaceImage>
        
        <ModalHeader>
          <h2 className="text-xl font-bold text-white">
            {placeDetails?.name || place.name}
          </h2>
          <div className="flex items-center mt-1">
            {placeDetails?.types && (
              <span className="text-sm text-gray-400 mr-2">
                {getDisplayType(placeDetails.types)}
              </span>
            )}
            {placeDetails?.rating && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" fill="#FBBF24" />
                <span className="text-sm text-gray-300">{placeDetails.rating}</span>
              </div>
            )}
          </div>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300">
                {placeDetails?.formatted_address || place.formatted_address}
              </p>
            </div>
            
            {placeDetails?.formatted_phone_number && (
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2" />
                <span>{placeDetails.formatted_phone_number}</span>
              </div>
            )}
            
            {placeDetails?.website && (
              <div className="flex items-center text-blue-400 hover:text-blue-300">
                <Globe size={16} className="mr-2" />
                <a 
                  href={placeDetails.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="truncate"
                >
                  {placeDetails.website}
                </a>
              </div>
            )}
            
            {placeDetails?.opening_hours && typeof placeDetails.opening_hours.isOpen === 'function' && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Opening Hours</h3>
                <div className="text-sm text-gray-400">
                  {isPlaceOpen() 
                    ? <span className="text-green-400">Currently Open</span> 
                    : <span className="text-red-400">Currently Closed</span>
                  }
                </div>
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onAddToRoute}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
          >
            Add to Route
          </button>
        </ModalFooter>
      </ModalContent>
    </PlacePreviewModal>
  );
};

export default function CreateRoute() {
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [allRoutes, setAllRoutes] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  
  // Creation stage state
  const [creationStage, setCreationStage] = useState<'route-creation' | 'route-details'>('route-creation');
  
  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // User verification state
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    stops?: string;
  }>({});
  
  // Search box reference
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isAddingStop = useRef(false);

  // Viewport state
  const [viewport, setViewport] = useState<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: { lat: 51.505, lng: -0.09 },
    zoom: 13,
  });

  // Create Supabase client
  const supabase = createClient();

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry'],
  });

  // Initialize travel mode after Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      // Always use walking mode
      setTravelMode(window.google.maps.TravelMode.WALKING);
    }
  }, [isLoaded]);

  // Check user verification status
  useEffect(() => {
    async function checkVerification() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push('/sign-in?redirectedFrom=/create-route');
      return;
    }

        setUserId(session.user.id);
        
        // Check if user is verified
        const isUserVerified = await routeService.canUserCreateRoutes(session.user.id);
        
        if (!isUserVerified) {
          router.push('/verification-required');
          return;
        }
        
        setIsVerified(true);
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsCheckingVerification(false);
      }
    }
    
    checkVerification();
  }, [router, supabase]);
  
  // Use geolocation to center map if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        setViewport({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 14
          });
        },
        () => {
          // Default to London if geolocation fails
          console.log('Geolocation permission denied, using default location');
        }
      );
    }
  }, []);

  // Handle stop reordering via drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStops(items);
    useRouteStore.getState().updateStops(items);
  };

  // Handle map click to add stops
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (isAddingStop.current && event.latLng) {
      const newLocation: MapLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      // Use Geocoding API to get address information for the clicked location
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          // Extract address components
          newLocation.address = results[0].formatted_address;
          newLocation.placeId = results[0].place_id;
          newLocation.name = results[0].address_components[0].short_name;
          
          addStop(newLocation);
        } else {
          // Even without geocoding result, still add the stop with coordinates
          addStop(newLocation);
        }
      });
      
      isAddingStop.current = false;
    }
  };

  // Function to add a new stop
  const addStop = (location: MapLocation) => {
    const newStop: RouteStop = {
      id: nanoid(),
      location,
      notes: '',
      duration: 0
    };
    
    const updatedStops = [...stops, newStop];
    setStops(updatedStops);
    useRouteStore.getState().updateStops(updatedStops);
  };

  // Handle Places search
  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;
    
    console.log("Places changed triggered");
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;
    
    console.log("Selected place:", places[0]);
    // Instead of adding directly, show the preview modal
    setSelectedPlace(places[0]);
    
    // Update map to show the selected place
    if (map && places[0].geometry?.location) {
      const location = places[0].geometry.location;
      
      map.setCenter({
        lat: location.lat(),
        lng: location.lng()
      });
      
      map.setZoom(15);
    }
    
    // Clear the search input
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  // Handle adding a place from the preview modal
  const handleAddPlaceFromModal = () => {
    console.log("Adding place from modal");
    if (!selectedPlace || !selectedPlace.geometry?.location) return;
    
    const location = selectedPlace.geometry.location;
    
    // Create a new location object
    const newLocation: MapLocation = {
      lat: location.lat(),
      lng: location.lng(),
      name: selectedPlace.name || '',
      address: selectedPlace.formatted_address || '',
      placeId: selectedPlace.place_id || '',
    };
    
    // Add the stop
    addStop(newLocation);
    
    // Close the modal
    setSelectedPlace(null);
  };
  
  // Close the place preview modal
  const handleClosePreviewModal = () => {
    setSelectedPlace(null);
  };

  // Function to remove a stop
  const removeStop = (id: string) => {
    const updatedStops = stops.filter(stop => stop.id !== id);
    setStops(updatedStops);
    useRouteStore.getState().updateStops(updatedStops);
    
    if (selectedStopId === id) {
      setSelectedStopId(null);
    }
  };

  // Function to update a stop's properties
  const updateStop = (id: string, data: Partial<RouteStop>) => {
    const updatedStops = stops.map(stop => 
      stop.id === id ? { ...stop, ...data } : stop
    );
    
    setStops(updatedStops);
    useRouteStore.getState().updateStops(updatedStops);
  };

  // Handle marker drag end
  const handleMarkerDragEnd = (id: string, e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation: MapLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      
      // Use Geocoding API to get updated address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          newLocation.address = results[0].formatted_address;
          newLocation.placeId = results[0].place_id;
          
          updateStop(id, { location: newLocation });
        } else {
          updateStop(id, { location: newLocation });
        }
      });
    }
  };

  // Validate route data before saving
  const validateRoute = (): boolean => {
    const errors: {
      title?: string;
      description?: string;
      category?: string;
      stops?: string;
    } = {};
    
    if (!title.trim()) {
      errors.title = 'Route title is required';
    }
    
    if (!description.trim()) {
      errors.description = 'Route description is required';
    }
    
    if (!category) {
      errors.category = 'Please select a category';
    }
    
    if (stops.length < 2) {
      errors.stops = 'At least 2 stops are required for a route';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to proceed to the details stage
  const proceedToDetails = () => {
    if (stops.length < 2) {
      setValidationErrors(prev => ({
        ...prev,
        stops: 'You need at least 2 stops to create a route'
      }));
      return;
    }
    setCreationStage('route-details');
  };

  // Function to go back to route creation
  const backToRouteCreation = () => {
    setCreationStage('route-creation');
  };

  // Preview route
  const handlePreview = () => {
    if (validateRoute()) {
      setIsPreviewMode(true);
      setPreviewError(null);
    }
  };

  // Save route
  const handleSave = async () => {
    if (!validateRoute() || !userId) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare route data
      const routeData: RouteData = {
        title,
        description,
        category,
        stops: stops,
      directions: directions || undefined,
        duration: directions?.routes[0].legs.reduce((total, leg) => total + (leg.duration?.value || 0), 0) || 0,
        distance: directions?.routes[0].legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0) || 0
      };
      
      // Save to database
      await routeService.createRoute(userId, routeData);
      
      // Redirect to route view or profile page
      router.push('/profile');
    } catch (error) {
      console.error('Error saving route:', error);
      setPreviewError('Failed to save route. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Exit preview mode
  const exitPreview = () => {
    setIsPreviewMode(false);
  };

  // Restore the calculateDirections function
  const calculateDirections = useCallback(() => {
    if (!isLoaded || !window.google || stops.length < 2) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Extract waypoints (all stops except first and last)
    const waypoints = stops.slice(1, -1).map((stop) => ({
      location: new window.google.maps.LatLng(stop.location.lat, stop.location.lng),
      stopover: true,
    }));

    const origin = new window.google.maps.LatLng(
      stops[0].location.lat,
      stops[0].location.lng
    );
    const destination = new window.google.maps.LatLng(
      stops[stops.length - 1].location.lat,
      stops[stops.length - 1].location.lng
    );

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        // Always use walking mode
        travelMode: window.google.maps.TravelMode.WALKING,
        optimizeWaypoints: false,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: window.google.maps.TrafficModel.PESSIMISTIC,
        },
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setAllRoutes(result?.routes || []);
          
          // Adjust viewport to fit the route
          if (map && result?.routes[0]?.bounds) {
            map.fitBounds(result.routes[0].bounds);
          }
        } else {
          console.error(`Directions request failed: ${status}`);
        }
      }
    );
  }, [isLoaded, stops, map]);

  // Calculate directions when stops change
  useEffect(() => {
    if (!isLoaded || !map || stops.length < 2) {
      setDirections(null);
      return;
    }

    calculateDirections();
  }, [stops, map, isLoaded, calculateDirections]);

  if (loadError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
          <div className="text-center">
          <div className="mb-4 text-red-500">Error loading Google Maps</div>
          <p className="text-gray-600">Please check your API key and try again.</p>
          </div>
        </div>
    );
  }

  if (isCheckingVerification) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-700">Checking permission...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-700">Loading map...</p>
          </div>
        </div>
    );
  }

  if (!isVerified) {
    // This is a fallback, users should be redirected by the useEffect
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verification Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be a verified explorer to create routes. This helps us maintain quality and authenticity across our platform.
          </p>
          <Link
            href="/verification-required"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md text-center"
          >
            Apply for Verification
          </Link>
        </div>
      </div>
    );
  }

  // Render route creation interface
  return (
    <Container>
      {/* Place Preview Modal */}
      {selectedPlace && (
        <PlacePreviewModalComponent
          place={selectedPlace}
          onClose={handleClosePreviewModal}
          onAddToRoute={handleAddPlaceFromModal}
        />
      )}

      {creationStage === 'route-creation' ? (
        <>
      <Sidebar>
        <SidebarHeader>
              <h2 className="text-lg font-semibold">Create New Route</h2>
        </SidebarHeader>

        <SidebarContent>
              <StopHeader>
                <h3 className="text-sm font-medium">Route Stops</h3>
                {validationErrors.stops && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.stops}</p>
                )}
              </StopHeader>
              
              <LocationList>
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="stops" isDropDisabled={false}>
              {(provided) => (
                      <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                        {stops.length === 0 ? (
                          <div className="p-4 text-gray-400 text-center">
                            <p>Your route has no stops yet.</p>
                            <p className="text-sm">Search for a place or click on the map to add stops.</p>
                          </div>
                        ) : (
                          stops.map((stop, index) => (
                            <Draggable key={stop.id} draggableId={stop.id} index={index}>
                      {(provided, snapshot) => (
                        <StopItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                          $isDragging={snapshot.isDragging}
                                  onClick={() => setSelectedStopId(selectedStopId === stop.id ? null : stop.id)}
                                >
                                  <GripVertical size={16} className="text-gray-400 flex-shrink-0" />
                                  
                                  <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                    {index + 1}
                          </div>
                                  
                          <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {stop.location.name || `Stop ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {stop.location.address || 'No address available'}
                                    </p>
                            </div>
                                  
                          <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeStop(stop.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <X size={16} />
                          </button>
                        </StopItem>
                      )}
                    </Draggable>
                          ))
                        )}
                  {provided.placeholder}
                      </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
              </LocationList>
        </SidebarContent>

        <SidebarFooter>
              <div className="flex space-x-3">
          <button
                  onClick={proceedToDetails}
            disabled={stops.length < 2}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
                  Continue to Details
          </button>
              </div>
        </SidebarFooter>
      </Sidebar>

      <MapContainer>
        <SearchOverlay>
          <SearchContainer>
                <StandaloneSearchBox
                  onLoad={(ref) => {
                    searchBoxRef.current = ref;
                  }}
                  onPlacesChanged={handlePlacesChanged}
                >
                  <div className="search-input-container">
                <input
                  ref={searchInputRef}
                  type="text"
                      placeholder="Search for a place to add..."
                      className="search-input"
                />
            </div>
                </StandaloneSearchBox>
          </SearchContainer>
        </SearchOverlay>

            {directions && (
              <CustomizationOverlay>
                <h3 className="font-medium text-white mb-2">Route Editor</h3>
                <RouteStatusIndicator $modified={false}>
                  <span className="text-sm text-white">
                    Original route path
                  </span>
                </RouteStatusIndicator>
                <p className="text-sm text-gray-300 mb-3">
                  <span className="text-indigo-400 font-medium">• Drag the route line</span> directly to customize your path.
                </p>
                <p className="text-sm text-gray-300 mb-3">
                  <span className="text-indigo-400 font-medium">• Blue dots</span> are Google's handles for adjusting the route.
                </p>
              </CustomizationOverlay>
            )}

        <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
          center={viewport.center}
              zoom={viewport.zoom}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
                streetViewControl: false,
            gestureHandling: 'greedy',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
              onClick={handleMapClick}
              onLoad={(map) => setMap(map)}
            >
              {stops.map((stop, index) => (
                <Marker
                  key={stop.id}
                  position={{ lat: stop.location.lat, lng: stop.location.lng }}
                  label={{ text: (index + 1).toString(), color: 'white' }}
                  draggable={true}
                  onDragEnd={(e) => handleMarkerDragEnd(stop.id, e)}
                  onMouseOver={() => setHoveredMarker(stop.id)}
                  onMouseOut={() => setHoveredMarker(null)}
                >
                  {hoveredMarker === stop.id && (
                    <InfoWindow onCloseClick={() => setHoveredMarker(null)}>
                      <div className="p-1">
                        <p className="font-medium text-gray-900">{stop.location.name || `Stop ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">{stop.location.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}

              {directions && <CustomRouteEditor 
                stops={stops}
                initialDirections={directions}
                onDirectionsChange={(newDirections) => {
                  setDirections(newDirections);
                }}
                onStopsChange={(updatedStops) => {
                  setStops(updatedStops);
                  useRouteStore.getState().updateStops(updatedStops);
                }}
                isLoaded={isLoaded}
              />}
              
              {allRoutes.length > 1 && (
                <RouteOptions>
                  {allRoutes.map((_, index) => (
                    <RouteOption
                      key={index}
                      onClick={() => setSelectedRouteIndex(index)}
                      $isSelected={index === selectedRouteIndex}
                    >
                      Route {index + 1}
                    </RouteOption>
                  ))}
                </RouteOptions>
              )}
            </GoogleMap>
            
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => { isAddingStop.current = true; }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all"
                title="Add stop by clicking on map"
              >
                <Plus size={24} />
              </button>
                    </div>
          </MapContainer>
        </>
      ) : (
        <>
          <Sidebar>
            <SidebarHeader>
              <h2 className="text-lg font-semibold">Route Details</h2>
            </SidebarHeader>

            <SidebarContent>
              <StopHeader>
                <h3 className="text-sm font-medium">Route Stops</h3>
              </StopHeader>
              
              <LocationList>
                {stops.map((stop, index) => (
                  <div 
                    key={stop.id} 
                    className="p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                    onClick={() => setSelectedStopId(selectedStopId === stop.id ? null : stop.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {index + 1}
                  </div>
                      <h4 className="font-medium">{stop.location.name || `Stop ${index + 1}`}</h4>
                    </div>
                    
                    {selectedStopId === stop.id && (
                      <div className="ml-8 space-y-3 mt-2">
                        <textarea
                          value={stop.notes || ''}
                          onChange={(e) => updateStop(stop.id, { notes: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md text-white text-sm p-2"
                          placeholder="Add notes or description for this stop..."
                          rows={4}
                        />
                        
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Time to Spend Here (minutes)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={stop.duration || 0}
                            onChange={(e) => updateStop(stop.id, { duration: parseInt(e.target.value) })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-white text-sm p-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </LocationList>
            </SidebarContent>

            <SidebarFooter>
              <div className="flex space-x-3">
                <button
                  onClick={backToRouteCreation}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md py-2 px-4 font-medium flex items-center justify-center"
                >
                  Back
                </button>
                <button
                  onClick={handlePreview}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4 font-medium flex items-center justify-center"
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <MapContainer>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={viewport.center}
              zoom={viewport.zoom}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                gestureHandling: 'greedy',
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                  },
                ],
              }}
              onLoad={(map) => setMap(map)}
            >
          {stops.map((stop, index) => (
            <Marker
              key={stop.id}
              position={{ lat: stop.location.lat, lng: stop.location.lng }}
              label={{ text: (index + 1).toString(), color: 'white' }}
              draggable={true}
              onDragEnd={(e) => handleMarkerDragEnd(stop.id, e)}
              onMouseOver={() => setHoveredMarker(stop.id)}
              onMouseOut={() => setHoveredMarker(null)}
            >
              {hoveredMarker === stop.id && (
                <InfoWindow onCloseClick={() => setHoveredMarker(null)}>
                  <div className="p-1">
                    <p className="font-medium text-gray-900">{stop.location.name || `Stop ${index + 1}`}</p>
                    <p className="text-sm text-gray-600">{stop.location.address}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}

              {directions && <CustomRouteEditor 
                stops={stops}
                initialDirections={directions}
                isPreviewMode={true}
                isLoaded={isLoaded}
              />}
              
              {allRoutes.length > 1 && (
                <RouteOptions>
                  {allRoutes.map((_, index) => (
                  <RouteOption
                    key={index}
                    onClick={() => setSelectedRouteIndex(index)}
                    $isSelected={index === selectedRouteIndex}
                  >
                      Route {index + 1}
                  </RouteOption>
                  ))}
            </RouteOptions>
          )}
        </GoogleMap>
      </MapContainer>
        </>
      )}
    </Container>
  );
} 