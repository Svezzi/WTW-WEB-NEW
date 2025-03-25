'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import { useRouter } from 'next/navigation';
import { MapLocation, RouteStop, RouteData } from '@/config/googleMapsConfig';
import { MapPin, GripVertical, X, Clock, Plus, Loader2 } from 'lucide-react';
import { useRouteStore } from '@/stores/routeStore';

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

interface RouteWaypoint {
  id: string;
  location: MapLocation;
  isShaping: boolean;
}

interface DirectionsWaypoint {
  location: google.maps.LatLng;
  stopover: boolean;
}

export default function CreateRoute() {
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [viewport, setViewport] = useState<{ center: google.maps.LatLngLiteral, zoom: number }>({
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 12
  });

  // Add a ref to track if we're adding a new stop
  const isAddingStop = useRef(false);

  // Add state for hoveredMarker
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'] as ['places'],
  });

  // Modify the directions effect to preserve viewport when dragging
  useEffect(() => {
    if (!isLoaded || !map || stops.length < 2) {
      setDirections(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      draggable: true,
      suppressMarkers: true,
      preserveViewport: !isAddingStop.current,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 6,
        strokeOpacity: 0.8,
        zIndex: 2
      }
    });

    // Add listener for route updates
    const listener = directionsRenderer.addListener("directions_changed", () => {
      const newDirections = directionsRenderer.getDirections();
      if (newDirections) {
        setDirections(newDirections);
      }
    });

    // Display initial route
    const request = {
      origin: { lat: stops[0].location.lat, lng: stops[0].location.lng },
      destination: { lat: stops[stops.length - 1].location.lat, lng: stops[stops.length - 1].location.lng },
      waypoints: stops.slice(1, -1).map(stop => ({
        location: { lat: stop.location.lat, lng: stop.location.lng },
        stopover: true
      })),
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypoints: false
    };

    directionsService
      .route(request)
      .then((result) => {
        directionsRenderer.setDirections(result);
        setDirections(result);

        // If adding a stop and it's the second stop, fit bounds
        if (isAddingStop.current && stops.length === 2) {
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach(leg => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          
          // Add padding to the bounds
          map.fitBounds(bounds, { 
            top: 100, 
            bottom: 100, 
            left: 400,
            right: 100 
          });
        }

        isAddingStop.current = false;
      })
      .catch((e) => {
        console.error("Could not display directions due to: " + e);
        isAddingStop.current = false;
      });

    // Cleanup function
    return () => {
      google.maps.event.removeListener(listener);
      directionsRenderer.setMap(null);
    };
  }, [stops, map, isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Set and store initial center
    const londonCenter = { lat: 51.5074, lng: -0.1278 };
    map.setCenter(londonCenter);
    map.setZoom(12);
    setViewport({ center: londonCenter, zoom: 12 });

    // Add listener for viewport changes
    map.addListener('idle', () => {
      const center = map.getCenter();
      if (center) {
        setViewport({
          center: center.toJSON(),
          zoom: map.getZoom() || 12
        });
      }
    });
  }, []);

  // Modify place selection to preserve zoom
  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current || !map) return;
    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry?.location || !place.place_id) {
      console.error('No geometry or place_id found for place');
      return;
    }

    const mapDiv = map.getDiv();
    if (!mapDiv) return;

    const previousZoom = map.getZoom() ?? 16;
    const targetLat = place.geometry.location.lat();
    const targetLng = place.geometry.location.lng();

    // Calculate sidebar offset
    const sidebarWidth = 400;
    const mapWidth = mapDiv.offsetWidth;
    const pixelsPerLng = mapWidth / (360 / Math.pow(2, previousZoom));
    const lngOffset = (sidebarWidth / 2) / pixelsPerLng;

    // Set center with offset but maintain zoom
    const adjustedCenter = {
      lat: targetLat,
      lng: targetLng + lngOffset
    } as google.maps.LatLngLiteral;

    map.setCenter(adjustedCenter);
    map.setZoom(previousZoom);

    // Use the existing map instance for PlacesService
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: place.place_id,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'photos',
          'opening_hours',
          'place_id'
        ]
      },
      (placeResult, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && placeResult) {
          setSelectedPlace(placeResult as PlaceDetails);
          setViewport({ center: adjustedCenter, zoom: previousZoom });
        }
      }
    );
  }, [map]);

  const handleAddToRoute = useCallback(() => {
    if (!selectedPlace || !selectedPlace.geometry?.location || !map) return;

    // Set the flag before adding the stop
    isAddingStop.current = true;

    const newStop: RouteStop = {
      id: Date.now().toString(),
      location: {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
        name: selectedPlace.name,
        address: selectedPlace.formatted_address,
        placeId: selectedPlace.place_id
      },
      notes: '',
      duration: 30,
    };

    setStops(prev => [...prev, newStop]);
    
    // Clear the search input and selected place
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setSelectedPlace(null);
  }, [selectedPlace, map]);

  // Modify the zoom effect to only trigger when adding stops
  useEffect(() => {
    if (!map || !directions || !stops.length || !isAddingStop.current) return;

    // Only zoom to fit bounds when adding the second stop
    if (stops.length === 2) {
      const bounds = new google.maps.LatLngBounds();
      directions.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
      });
      
      // Add padding to the bounds
      map.fitBounds(bounds, { 
        top: 100, 
        bottom: 100, 
        left: 400, // Account for sidebar
        right: 100 
      });
    }

    // Reset the flag after zooming
    isAddingStop.current = false;
  }, [map, directions, stops.length]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const newStops = Array.from(stops);
    const [reorderedItem] = newStops.splice(result.source.index, 1);
    newStops.splice(result.destination.index, 0, reorderedItem);

    setStops(newStops);
  }, [stops]);

  const removeStop = (stopId: string) => {
    setStops(prev => {
      const newStops = prev.filter(stop => stop.id !== stopId);
      // Clear directions if fewer than 2 stops remain
      if (newStops.length < 2) {
        setDirections(null);
        setSelectedRouteIndex(0);
      }
      return newStops;
    });
  };

  const updateStopNotes = (stopId: string, notes: string) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId ? { ...stop, notes } : stop
    ));
  };

  const updateStopDuration = (stopId: string, duration: number) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId ? { ...stop, duration } : stop
    ));
  };

  const handleSave = async () => {
    if (stops.length < 2) return;

    const routeData = {
      stops,
      duration: stops.reduce((total, stop) => total + (stop.duration || 0), 0),
      directions: directions || undefined,
    };

    // Save route data to store
    useRouteStore.getState().setRouteData(routeData);
    
    // Navigate to the details page
    router.push('/create-route/details');
  };

  if (loadError) {
    return (
      <Container>
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading Google Maps</p>
            <p className="text-gray-400">Please check your API key and try again</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!isLoaded) {
    return (
      <Container>
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#4CAF50] mx-auto mb-2" />
            <p className="text-gray-400">Loading maps...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-xl font-bold text-gray-100">Create New Route</h1>
          <p className="mt-1 text-sm text-gray-400">
            {stops.length} {stops.length === 1 ? 'stop' : 'stops'} added
          </p>
        </SidebarHeader>

        <SidebarContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="stops">
              {(provided) => (
                <LocationList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {stops.map((stop, index) => (
                    <Draggable
                      key={stop.id}
                      draggableId={stop.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <StopItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          $isDragging={snapshot.isDragging}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hover:text-[#4CAF50]">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-100 truncate">
                              {index + 1}. {stop.location.name || 'Unnamed Location'}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                              {stop.location.address}
                            </div>
                          </div>
                          <button
                            onClick={() => removeStop(stop.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </StopItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {[...Array(Math.max(0, 3 - stops.length))].map((_, index) => (
                    <EmptyStop key={index}>
                      <EmptyDot />
                      <EmptyContent />
                    </EmptyStop>
                  ))}
                </LocationList>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </SidebarContent>

        <SidebarFooter>
          <button
            onClick={handleSave}
            disabled={stops.length < 2}
            className="w-full py-2.5 bg-[#4CAF50] text-white rounded-md font-medium hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stops.length < 2 ? 'Add at least 2 stops' : 'Continue to Details'}
          </button>
        </SidebarFooter>
      </Sidebar>

      <MapContainer>
        <SearchOverlay>
          <SearchContainer>
            <div className="search-input-container">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <Autocomplete
                onLoad={autocomplete => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceSelect}
                options={{
                  fields: ['place_id', 'geometry', 'name', 'formatted_address', 'photos', 'rating', 'opening_hours'],
                  strictBounds: false,
                  types: ['establishment', 'geocode']
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for location"
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </Autocomplete>
            </div>
          </SearchContainer>
        </SearchOverlay>

        <GoogleMap
          mapContainerStyle={{ 
            width: '100%', 
            height: '100%'
          }}
          center={viewport.center}
          options={{
            zoom: viewport.zoom,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            disableDoubleClickZoom: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
          onLoad={onMapLoad}
        >
          {selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location && (
            <InfoWindow
              position={viewport.center}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="min-w-[300px] max-w-[350px] p-4">
                {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                  <div className="relative h-[150px] w-full overflow-hidden rounded-lg mb-4">
                    <img 
                      src={selectedPlace.photos[0].getUrl()}
                      alt={selectedPlace.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedPlace.name}
                </h3>

                {selectedPlace.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(selectedPlace.rating || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedPlace.rating}
                    </span>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-3">
                  📍 {selectedPlace.formatted_address}
                </p>

                {selectedPlace.opening_hours && (
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedPlace.opening_hours.isOpen?.() ? 
                      '✅ Open now' : '❌ Closed'}
                  </p>
                )}

                <button
                  onClick={handleAddToRoute}
                  className="w-full px-4 py-2 bg-[#4CAF50] text-white rounded-md font-medium hover:bg-[#45a049] flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Route
                </button>
              </div>
            </InfoWindow>
          )}

          {stops.map((stop, index) => (
            <Marker
              key={stop.id}
              position={{ lat: stop.location.lat, lng: stop.location.lng }}
              label={{
                text: (index + 1).toString(),
                color: 'white',
                className: 'font-bold'
              }}
              onClick={() => {
                const confirmDelete = window.confirm(`Remove stop ${index + 1}?`);
                if (confirmDelete) {
                  removeStop(stop.id);
                }
              }}
              onMouseOver={() => setHoveredMarker(stop.id)}
              onMouseOut={() => setHoveredMarker(null)}
              options={{
                draggable: false,
                zIndex: 4,
                cursor: 'pointer'
              }}
            >
              {hoveredMarker === stop.id && (
                <InfoWindow
                  onCloseClick={() => setHoveredMarker(null)}
                >
                  <div className="p-2">
                    <p className="font-medium">{stop.location.name}</p>
                    <p className="text-sm text-gray-600">{stop.location.address}</p>
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                    >
                      Remove Stop
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}

          {directions && directions.routes.length > 1 && (
            <RouteOptions>
              {directions.routes.map((route, index) => {
                const duration = route.legs.reduce((total, leg) => total + (leg.duration?.value || 0), 0);
                const minutes = Math.round(duration / 60);
                const distance = route.legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0);
                const km = (distance / 1000).toFixed(1);
                
                return (
                  <RouteOption
                    key={index}
                    onClick={() => setSelectedRouteIndex(index)}
                    $isSelected={index === selectedRouteIndex}
                  >
                    Route {index + 1} ({minutes} min • {km} km)
                  </RouteOption>
                );
              })}
            </RouteOptions>
          )}
        </GoogleMap>
      </MapContainer>
    </Container>
  );
} 