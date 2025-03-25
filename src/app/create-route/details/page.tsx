'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { routeService } from '@/services/routeService';
import { useRouteStore } from '@/stores/routeStore';
import { RouteStop } from '@/config/googleMapsConfig';
import { Loader2, Clock, MapPin, Star, Phone, Globe, Clock as ClockIcon } from 'lucide-react';
import { useJsApiLoader, DirectionsService } from '@react-google-maps/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: #1F2937;
  color: #F3F4F6;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4B5563;
  border-radius: 0.375rem;
  color: #F3F4F6;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4B5563;
  border-radius: 0.375rem;
  color: #F3F4F6;
  margin-top: 0.5rem;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4B5563;
  border-radius: 0.375rem;
  color: #F3F4F6;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #F3F4F6;
  margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #45a049;
  }
`;

interface PlaceDetails {
  name: string;
  formatted_address: string;
  photos?: google.maps.places.PlacePhoto[];
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
    isOpen: () => boolean;
  };
}

export default function RouteDetails() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { routeData, setRouteData, clearRoute } = useRouteStore();
  const [stops, setStops] = useState<RouteStop[]>(routeData.stops || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [routeDurations, setRouteDurations] = useState<number[]>([]);
  const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetails>>({});
  const { user } = useAuth();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'] as ['places'],
  });

  // Fetch place details for each stop
  useEffect(() => {
    if (!isLoaded || !stops.length) return;

    const fetchPlaceDetails = async () => {
      const placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const details: Record<string, PlaceDetails> = {};

      for (const stop of stops) {
        if (!stop.location.placeId || details[stop.location.placeId]) continue;

        try {
          const result = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
            placesService.getDetails(
              {
                placeId: stop.location.placeId!,
                fields: ['name', 'formatted_address', 'photos', 'rating', 'user_ratings_total', 
                        'formatted_phone_number', 'website', 'opening_hours']
              },
              (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                  resolve(place);
                } else {
                  reject(status);
                }
              }
            );
          });

          details[stop.location.placeId] = result as PlaceDetails;
        } catch (error) {
          console.error('Error fetching place details:', error);
        }
      }

      setPlaceDetails(details);
    };

    fetchPlaceDetails();
  }, [stops, isLoaded]);

  // Calculate route durations when stops change
  useEffect(() => {
    if (!isLoaded || stops.length < 2) return;

    const calculateDurations = async () => {
      const durations: number[] = [];
      const directionsService = new google.maps.DirectionsService();

      for (let i = 0; i < stops.length - 1; i++) {
        try {
          const result = await directionsService.route({
            origin: { lat: stops[i].location.lat, lng: stops[i].location.lng },
            destination: { lat: stops[i + 1].location.lat, lng: stops[i + 1].location.lng },
            travelMode: google.maps.TravelMode.WALKING,
          });

          if (result.routes[0]?.legs[0]?.duration?.value) {
            // Convert seconds to minutes and round up
            const durationInMinutes = Math.ceil(result.routes[0].legs[0].duration.value / 60);
            durations.push(durationInMinutes);
          }
        } catch (error) {
          console.error('Error calculating route duration:', error);
          durations.push(0);
        }
      }

      setRouteDurations(durations);
    };

    calculateDurations();
  }, [stops, isLoaded]);

  // Redirect if no route data or not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirectedFrom=/create-route');
      return;
    }
    
    if (!routeData.stops || routeData.stops.length < 2) {
      router.push('/create-route');
    }
  }, [routeData.stops, router, user]);

  const categories = [
    'Food & Drink',
    'Culture & History',
    'Nature & Parks',
    'Shopping',
    'Entertainment',
    'Hidden Gems',
    'Photography',
    'Art & Museums'
  ];

  const handleStopUpdate = (stopId: string, field: 'notes', value: string) => {
    const updatedStops = stops.map(stop =>
      stop.id === stopId ? { ...stop, [field]: value } : stop
    );
    setStops(updatedStops);
    setRouteData({ stops: updatedStops });
  };

  const handleSave = async () => {
    console.log('Starting save process...');
    console.log('Current form state:', { title, description, category });
    console.log('Current user:', user);
    console.log('Current stops:', stops);

    // Validate form fields
    if (!title || !description || !category) {
      console.error('Missing required fields:', { title, description, category });
      setError('Please fill in all required fields');
      return;
    }

    // Validate user
    if (!user) {
      console.error('No user found');
      setError('You must be logged in to save a route');
      return;
    }

    // Validate stops
    if (!stops || stops.length < 2) {
      console.error('Invalid stops:', stops);
      setError('A route must have at least 2 stops');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Preparing route data...');
      
      // Validate stop data
      const validStops = stops.every(stop => 
        stop.id && 
        stop.location && 
        typeof stop.location.lat === 'number' && 
        typeof stop.location.lng === 'number'
      );

      if (!validStops) {
        throw new Error('Invalid stop data detected');
      }

      const finalRouteData = {
        title,
        description,
        category,
        stops: stops.map(stop => ({
          id: stop.id,
          location: {
            lat: stop.location.lat,
            lng: stop.location.lng,
            name: stop.location.name,
            address: stop.location.address,
            placeId: stop.location.placeId
          },
          notes: stop.notes || '',
        })),
        duration: routeDurations.reduce((total, duration) => total + duration, 0),
      };

      console.log('Final route data:', JSON.stringify(finalRouteData, null, 2));
      console.log('Attempting to save to Firebase...');

      const routeId = await routeService.createRoute(user.uid, finalRouteData);
      console.log('Route saved successfully with ID:', routeId);
      
      // Clear store and navigate to the new route
      clearRoute();
      router.push(`/routes/${routeId}`);
    } catch (error: any) {
      console.error('Detailed error saving route:', error);
      setError(error.message || 'Failed to save route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    await handleSave();
  };

  if (!user || !routeData.stops || !isLoaded) {
    return null; // Let useEffect handle the redirect
  }

  return (
    <Container>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <div>
            <FormLabel htmlFor="title">Route Title</FormLabel>
            <FormInput
              id="title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter a title for your route"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormTextarea
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe your route"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="category">Category</FormLabel>
            <FormSelect
              id="category"
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="space-y-6">
            <FormLabel>Stops</FormLabel>
            {stops.map((stop, index) => {
              const place = stop.location.placeId ? placeDetails[stop.location.placeId] : null;
              const photoUrl = place?.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });

              return (
                <div key={stop.id} className="overflow-hidden bg-gray-800 rounded-lg border border-gray-700">
                  {/* Stop Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-white">Stop {index + 1}</h3>
                      {place?.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{place.rating}</span>
                          <span className="text-gray-400">({place.user_ratings_total} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stop Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Left Column - Image and Basic Info */}
                    <div className="space-y-4">
                      {photoUrl ? (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={photoUrl}
                            alt={place?.name || stop.location.name || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-gray-500" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-white">{place?.name || stop.location.name}</h4>
                        <p className="text-sm text-gray-400">{place?.formatted_address || stop.location.address}</p>
                      </div>

                      {/* Contact Info */}
                      {(place?.formatted_phone_number || place?.website) && (
                        <div className="space-y-2 pt-2 border-t border-gray-700">
                          {place.formatted_phone_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Phone className="h-4 w-4" />
                              <span>{place.formatted_phone_number}</span>
                            </div>
                          )}
                          {place.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a 
                                href={place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 truncate"
                              >
                                {place.website}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Column - Notes and Additional Info */}
                    <div className="space-y-4">
                      <div>
                        <FormLabel htmlFor={`notes-${stop.id}`}>Notes</FormLabel>
                        <FormTextarea
                          id={`notes-${stop.id}`}
                          value={stop.notes || ''}
                          onChange={(e) => handleStopUpdate(stop.id, 'notes', e.target.value)}
                          placeholder="Add notes for this stop"
                        />
                      </div>

                      {/* Opening Hours */}
                      {place?.opening_hours?.weekday_text && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-white flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            Opening Hours
                          </h5>
                          <div className="text-sm text-gray-400 space-y-1">
                            {place.opening_hours.weekday_text.map((hours, i) => (
                              <p key={i}>{hours}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Walking Duration to Next Stop */}
                  {index < stops.length - 1 && routeDurations[index] > 0 && (
                    <div className="p-4 bg-gray-900 border-t border-gray-700">
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{routeDurations[index]} minutes walking to next stop</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Duration */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
            <span className="text-white font-medium">Total walking time:</span>
            <span className="text-gray-400">{routeDurations.reduce((total, duration) => total + duration, 0)} minutes</span>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Route'
            )}
          </SubmitButton>
        </div>
      </form>
    </Container>
  );
} 