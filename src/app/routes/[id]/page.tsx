'use client';

import { useState, useEffect, use } from 'react';
import styled from 'styled-components';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Clock, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/data/routes';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
  background-color: #111827;
  color: #E5E7EB;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  box-shadow: inset 0 -10px 10px -10px rgba(0,0,0,0.3);
`;

const MainContent = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  margin: -80px 0 48px 0;
  position: relative;
  padding: 32px;
  background: #1F2937;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border: 1px solid #374151;
`;

const RouteStats = styled.div`
  display: flex;
  gap: 24px;
  margin: 24px 0;
  padding: 16px;
  background: #111827;
  border-radius: 12px;
  border: 1px solid #374151;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E5E7EB;
  
  svg {
    color: #4CAF50;
  }
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 32px 0;
`;

const LocationCard = styled.div`
  border-radius: 12px;
  background: #1F2937;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: transform 0.2s;
  border: 1px solid #374151;

  &:hover {
    transform: translateY(-4px);
  }
`;

const LocationImage = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const LocationContent = styled.div`
  padding: 20px;
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const LocationNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
`;

const CreatorSection = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  border-top: 1px solid #374151;
  transition: background-color 0.2s;
  border-radius: 8px;
  
  &:hover {
    background-color: #374151;
  }
`;

const CreatorImage = styled.div`
  width: 48px;
  height: 48px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
`;

// Dummy route data for the Berlin Vintage Treasures route
const berlinVintageTreasuresData = {
  title: "Berlin Vintage Treasures: Second Hand Shopping Tour",
  description: "Historic markets, curated boutiques & hidden gems",
  duration: "5-6 hrs",
  distance: "7.2 km",
  rating: 4.8,
  reviews: 312,
  saves: 156,
  creator: {
    name: "Lena Schmidt",
    image: "/images/Local 2.jpg",
    title: "Vintage Fashion Curator",
    routes: 12
  },
  intro: "Berlin has long been a paradise for vintage lovers and sustainable fashion enthusiasts. As a fashion historian and longtime resident, I've curated this route to showcase the city's most unique second-hand shopping experiences. From weight-based treasure hunts to specialty vintage boutiques, this tour celebrates Berlin's dedication to slow fashion, history, and individual expression. Even if you don't buy anything, the spaces themselves tell fascinating stories about Berlin's evolving relationship with fashion and sustainability.",
  stops: [
    {
      id: 1,
      name: "Humana Vintage Store",
      description: "Start your second-hand journey at one of Berlin's largest vintage chains. This flagship store spans multiple floors packed with carefully curated decades-old fashion, from 70s disco shirts to 90s Berlin club wear.",
      image: "/images/HumanaVintageStore.jpg",
      location: { lat: 52.5156, lng: 13.4539 },
      proTip: "Visit on Mondays for newly stocked items. Their color-coding system makes it easy to find items from specific decades."
    },
    {
      id: 2,
      name: "Sing Blackbird",
      description: "Part café, part vintage boutique, this charming Neukölln spot offers carefully selected second-hand clothing alongside excellent vegan cakes and coffee. Browse through their retro dresses and accessories while enjoying a relaxing break.",
      image: "/images/SingBlackbird.jpg",
      location: { lat: 52.4889, lng: 13.4239 },
      proTip: "Their back garden is a hidden gem in summer. Check their Instagram for special sales events and new arrivals."
    },
    {
      id: 3,
      name: "Mauerpark Flea Market",
      description: "Berlin's most famous Sunday flea market is vintage shopping heaven. From GDR memorabilia to upcycled furniture, vintage clothing, and vinyl records, you'll find treasures from every era amidst the lively atmosphere.",
      image: "/images/MauerparkFleaMarket.jpg",
      location: { lat: 52.5419, lng: 13.4022 },
      proTip: "Arrive early (before 10am) to beat the crowds and find the best pieces. Don't forget to negotiate prices - it's expected!"
    },
    {
      id: 4,
      name: "Pick & Weight Kilo Store",
      description: "An innovative concept where you pay by weight, not by item. Fill your bag with vintage pieces from the 70s through the 00s, and pay a set price per kilo. Perfect for finding unique statement pieces on a budget.",
      image: "/images/PickAndWeightKiloStore.jpg",
      location: { lat: 52.4892, lng: 13.4008 },
      proTip: "They regularly rotate their stock with different themes and decades, so check their social media to see what's featured during your visit."
    },
    {
      id: 5,
      name: "Garage Vintage Store",
      description: "Finish your tour at this vast warehouse-style store filled with vintage clothing from floor to ceiling. Their unique system offers different pricing tiers, with some sections selling items by weight and others individually priced.",
      image: "/images/GarageVintageStore.jpg",
      location: { lat: 52.5006, lng: 13.3399 },
      proTip: "Don't miss their €1 bin, which often contains surprising gems if you're willing to dig. Their leather jacket collection is particularly renowned among vintage enthusiasts."
    }
  ]
};

// Route data for Romantic Evening in Paris
const romanticEveningData = {
  title: "Romantic Evening in Paris",
  description: "Experience the magic of Paris as the sun sets",
  duration: "2.5 hrs",
  distance: "4.5 km",
  rating: 4.9,
  reviews: 256,
  saves: 187,
  creator: {
    name: "Sophie Laurent",
    image: "/images/Local 5.jpg",
    title: "Parisian Tour Guide",
    routes: 9
  },
  intro: "Paris, the city of love, transforms into a magical realm as the sun sets. This carefully crafted evening route takes you through enchanting streets, secret viewpoints, and intimate spaces that showcase why Paris has captivated lovers for centuries. From the glittering Eiffel Tower to quiet riverside spots, discover the perfect atmosphere for romance away from the tourist crowds.",
  stops: [
    {
      id: 1,
      name: "Le Marais Sunset Start",
      description: "Begin your romantic evening in the charming district of Le Marais as the golden hour casts a warm glow over its historic buildings. Stroll hand-in-hand through narrow medieval streets lined with exclusive boutiques and art galleries.",
      image: "/images/LeMaraisSunsetStart.jpg",
      location: { lat: 48.8567, lng: 2.3508 },
      proTip: "Stop at Carette for a sweet treat before your walk. Their macarons are perfect for sharing."
    },
    {
      id: 2,
      name: "Pont des Arts",
      description: "Cross this famous pedestrian bridge at twilight for breathtaking views of the Seine. Once known for its 'love locks,' it's now a perfect spot to pause and watch the boats pass by while the city lights begin to twinkle.",
      image: "/images/PontDesArts.jpg",
      location: { lat: 48.8583, lng: 2.3375 },
      proTip: "Bring a small bottle of wine to enjoy on the bridge - it's perfectly acceptable and quintessentially Parisian."
    },
    {
      id: 3,
      name: "Hidden Café Laurent",
      description: "Tucked away in a courtyard of the Latin Quarter, this intimate jazz café offers the perfect romantic interlude. Sip expertly crafted cocktails while listening to live music in a space that feels untouched by time.",
      image: "/images/HiddenCafeLaurent.jpg",
      location: { lat: 48.8521, lng: 2.3463 },
      proTip: "Reserve a table in advance and request the corner by the pianist for the most intimate experience."
    },
    {
      id: 4,
      name: "Secret Garden Path",
      description: "Discover this little-known elevated walkway planted with lush flowers and vines. Lit by soft lanterns at night, it offers quiet moments away from the city's bustle and unexpected views of Parisian rooftops.",
      image: "/images/SecretGardenPath.jpg",
      location: { lat: 48.8410, lng: 2.3551 },
      proTip: "Look for the hidden entrance between the buildings on Rue Monge - most tourists walk right past it."
    },
    {
      id: 5,
      name: "La Tour d'Argent View",
      description: "End your evening near this legendary restaurant with one of the most spectacular nighttime views of Notre Dame Cathedral and the illuminated Seine. The perfect backdrop for a memorable moment.",
      image: "/images/LaTourDArgentView.png",
      location: { lat: 48.8502, lng: 2.3543 },
      proTip: "While the restaurant requires reservations months in advance, the view from nearby is free and equally breathtaking after dark."
    }
  ]
};

// Route data for Techno Trail
const technoTrailData = {
  title: "Berlin Techno Trail",
  description: "Follow the footsteps of Berlin's legendary techno scene",
  duration: "4-5 hrs",
  distance: "4.5 km",
  rating: 4.7,
  reviews: 312,
  saves: 198,
  creator: {
    name: "Dennis Weber",
    image: "/images/Local 6.jpg",
    title: "Music Journalist & DJ",
    routes: 8
  },
  intro: "Berlin's techno scene revolutionized electronic music worldwide. This route takes you through the historical landmarks and current hotspots that define the city's unique sound and club culture. From the fall of the Wall to today's vibrant scene, explore the spaces and places that made Berlin the techno capital of the world.",
  stops: [
    {
      id: 1,
      name: "Tresor Original Location",
      description: "Visit the site of the legendary club that helped define Berlin techno after the fall of the Wall. While the original vault is now gone, this historical spot marks where underground techno found its first home in unified Berlin.",
      image: "/images/TresorClub.jpg",
      location: { lat: 52.5107, lng: 13.4301 },
      proTip: "Look for the plaque commemorating the original location, easily missed by those who don't know its significance."
    },
    {
      id: 2,
      name: "Record Store Haven",
      description: "Browse through Hard Wax, one of the world's most influential techno record stores. Founded by Basic Channel's Mark Ernestus, it's been the source of Berlin's DJ culture since 1989.",
      image: "/images/HardWaxRecordStore.jpeg",
      location: { lat: 52.4977, lng: 13.4220 },
      proTip: "Don't be intimidated by the minimalist atmosphere - the staff are incredibly knowledgeable if you ask specific questions."
    },
    {
      id: 3,
      name: "Club der Visionaere",
      description: "Experience this intimate canal-side venue offering open-air electronic music. With its wooden deck and willow trees, it represents Berlin's more relaxed approach to club culture.",
      image: "/images/ClubDerVisionare.jpg",
      location: { lat: 52.4933, lng: 13.4517 },
      proTip: "Visit on Sunday afternoon for the legendary day parties that sometimes continue until Monday morning."
    },
    {
      id: 4,
      name: "Kraftwerk Berlin",
      description: "Marvel at this imposing power plant turned cultural venue, home to cutting-edge electronic music events and festivals like Berlin Atonal.",
      image: "/images/KratwerkBerlin.jpg",
      location: { lat: 52.5102, lng: 13.4284 },
      proTip: "Check their event schedule in advance - even if there's no music event, the industrial architecture alone is worth seeing."
    },
    {
      id: 5,
      name: "Berghain Perspective",
      description: "View the exterior of the world's most famous techno club, housed in a former power station. While entry is never guaranteed, understanding its cultural significance is essential to Berlin's techno story.",
      image: "/images/BerghainClub.jpg",
      location: { lat: 52.5115, lng: 13.4410 },
      proTip: "The best time to see the exterior without crowds is early evening before the club opens. For those wanting to try entry, remember: no photos inside is the golden rule."
    }
  ]
};

export default function RouteDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeData, setRouteData] = useState(berlinVintageTreasuresData);

  useEffect(() => {
    // Set the appropriate route data based on the ID
    if (id === 'berlin-vintage-treasures') {
      setRouteData(berlinVintageTreasuresData);
    } else if (id === 'romantic-evening-in-paris') {
      setRouteData(romanticEveningData);
    } else if (id === 'techno-trail') {
      setRouteData(technoTrailData);
    } else if (id === 'kreuzberg-nightlife' || id === 'street-food-tour' || id === 'mural-mile') {
      // For IDs that don't have specific data, find them in routes array
      const route = routes.find(r => r.id === id);
      if (route) {
        // Create a compatible route data object
        setRouteData({
          title: route.title,
          description: route.description,
          duration: route.duration === 'short' ? '1-2 hrs' : route.duration === 'medium' ? '2-4 hrs' : '4-6 hrs',
          distance: route.distance,
          rating: route.rating,
          reviews: route.reviews,
          saves: Math.floor(route.reviews * 0.7),
          creator: {
            name: route.creator.name,
            image: route.creator.image,
            title: "Local Guide",
            routes: Math.floor(Math.random() * 10) + 5
          },
          intro: `Discover the vibrant ${route.title.toLowerCase()} experience in Berlin through this carefully curated route. From hidden gems to popular hotspots, this journey showcases the best of what the city has to offer in this category.`,
          // Use default stops
          stops: berlinVintageTreasuresData.stops
        });
      } else {
        // Fallback to Berlin Vintage Treasures
        setRouteData(berlinVintageTreasuresData);
      }
    } else {
      // Default to Berlin Vintage Treasures
      setRouteData(berlinVintageTreasuresData);
    }
  }, [id]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'] as ['places'],
  });

  useEffect(() => {
    if (!isLoaded) return;

    const calculateRoute = async () => {
      const directionsService = new google.maps.DirectionsService();

      try {
        const result = await directionsService.route({
          origin: { lat: routeData.stops[0].location.lat, lng: routeData.stops[0].location.lng },
          destination: { 
            lat: routeData.stops[routeData.stops.length - 1].location.lat, 
            lng: routeData.stops[routeData.stops.length - 1].location.lng 
          },
          waypoints: routeData.stops.slice(1, -1).map(stop => ({
            location: { lat: stop.location.lat, lng: stop.location.lng },
            stopover: true
          })),
          travelMode: google.maps.TravelMode.WALKING
        });

        setDirections(result);
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    };

    calculateRoute();
  }, [isLoaded, routeData]);

  if (!isLoaded || !routeData) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading route...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: routeData.stops[0].location.lat, lng: routeData.stops[0].location.lng }}
          zoom={14}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#4CAF50',
                  strokeWeight: 5,
                  strokeOpacity: 0.8
                }
              }}
            />
          )}
        </GoogleMap>
      </MapContainer>

      <MainContent>
        <Header>
          <h1 className="text-3xl font-bold text-gray-100">{routeData.title}</h1>
          <p className="mt-4 text-gray-400">{routeData.description}</p>

          <RouteStats>
            <StatItem>
              <Clock className="h-5 w-5" />
              <span>{routeData.duration}</span>
            </StatItem>
            <StatItem>
              <MapPin className="h-5 w-5" />
              <span>{routeData.distance}</span>
            </StatItem>
            <StatItem>
              <Star className="h-5 w-5" />
              <span>{routeData.rating} ({routeData.reviews} reviews)</span>
            </StatItem>
          </RouteStats>

          <CreatorSection href={`/profile/${routeData.creator.name.toLowerCase().replace(' ', '')}`}>
            <CreatorImage>
              <Image
                src={routeData.creator.image}
                alt={routeData.creator.name}
                fill
                className="object-cover"
              />
            </CreatorImage>
            <div>
              <h3 className="font-medium text-gray-100">{routeData.creator.name}</h3>
              <p className="text-sm text-gray-400">
                {routeData.creator.title} • {routeData.creator.routes} routes created
              </p>
            </div>
          </CreatorSection>
        </Header>

        <LocationsGrid>
          {routeData.stops.map((stop, index) => (
            <LocationCard key={stop.id}>
              <LocationImage>
                <Image
                  src={stop.image}
                  alt={stop.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </LocationImage>
              <LocationContent>
                <LocationHeader>
                  <LocationNumber>{index + 1}</LocationNumber>
                  <h3 className="text-xl font-semibold text-gray-100">{stop.name}</h3>
                </LocationHeader>
                <p className="text-gray-400 text-sm">{stop.description}</p>
              </LocationContent>
            </LocationCard>
          ))}
        </LocationsGrid>
      </MainContent>
    </Container>
  );
} 