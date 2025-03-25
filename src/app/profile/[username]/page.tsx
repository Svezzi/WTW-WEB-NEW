'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { Clock, MapPin, Star } from 'lucide-react';
import { notFound } from 'next/navigation';

const Container = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #111827;
  color: #E5E7EB;
  padding: 40px 20px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 48px;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Stats = styled.div`
  display: flex;
  gap: 48px;
  margin: 24px 0;
  justify-content: center;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #E5E7EB;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #9CA3AF;
  margin-top: 4px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #374151;
  margin-bottom: 32px;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 0;
  color: ${props => props.active ? '#E5E7EB' : '#9CA3AF'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? '#4CAF50' : 'transparent'};
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #E5E7EB;
  }
`;

const RoutesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const RouteCard = styled(Link)`
  display: block;
  background: #1F2937;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #374151;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const RouteImage = styled.div`
  position: relative;
  height: 200px;
`;

const RouteContent = styled.div`
  padding: 16px;
`;

const RouteStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  color: #9CA3AF;
  font-size: 14px;
`;

// Profile data for all local guides
const profilesData = {
  'emma-wilson': {
    username: "emmawilson",
    name: "Emma Wilson",
    image: "/images/Local 8.jpg",
    bio: "Street photography expert based in London. Specializing in capturing the city's dynamic urban life and hidden corners. My routes take you through the most photogenic and authentic parts of the city.",
    title: "Street Photography Expert",
    location: "London",
    stats: {
      routesCreated: 24,
      followers: 1580,
      following: 143
    },
    routes: [
      {
        id: 1,
        title: "East London Street Art Trail",
        image: "/images/East London Tales.png",
        duration: "3 hours",
        distance: "4.2 km",
        likes: 847
      }
    ]
  },
  'isabella-romano': {
    username: "isabellaromano",
    name: "Isabella Romano",
    image: "/images/Local 2.jpg",
    bio: "Food and culture enthusiast sharing the authentic flavors of Rome. My routes combine culinary discoveries with historical insights, taking you through the city's most charming neighborhoods.",
    title: "Food & Culture Guide",
    location: "Rome",
    stats: {
      routesCreated: 18,
      followers: 1247,
      following: 95
    },
    routes: [
      {
        id: 1,
        title: "Roman Food & History Walk",
        image: "/images/Roman Mornings, Cafes, Markets and Ancient Paths.png",
        duration: "4 hours",
        distance: "3.8 km",
        likes: 723
      }
    ]
  },
  'maria-santos': {
    username: "mariasantos",
    name: "Maria Santos",
    image: "/images/060294b27f354634a3998f4111f0d502.jpg",
    bio: "History and architecture expert in Lisbon. I create routes that showcase the city's rich architectural heritage and historical significance, from medieval streets to modern designs.",
    title: "History & Architecture Expert",
    location: "Lisbon",
    stats: {
      routesCreated: 15,
      followers: 892,
      following: 78
    },
    routes: [
      {
        id: 1,
        title: "Lisbon's Architectural Gems",
        image: "/images/Montmartre Magic.png",
        duration: "3.5 hours",
        distance: "4.5 km",
        likes: 634
      }
    ]
  },
  'james-chen': {
    username: "jameschen",
    name: "James Chen",
    image: "/images/webimage-BF382495-FF39-4B62-8EF84884D4DABE4B-620x413.jpg",
    bio: "Urban explorer and photographer based in Singapore. My routes take you through the city's most vibrant districts, combining modern architecture with local culture.",
    title: "Urban Explorer",
    location: "Singapore",
    stats: {
      routesCreated: 21,
      followers: 1342,
      following: 156
    },
    routes: [
      {
        id: 1,
        title: "Singapore Modern Architecture",
        image: "/images/Marina Bay Moments.png",
        duration: "3 hours",
        distance: "3.2 km",
        likes: 756
      }
    ]
  },
  'anna-kowalsky': {
    username: "annakowalsky",
    name: "Anna Kowalsky",
    image: "/images/Umbella-Street.jpg",
    bio: "Cultural heritage guide in Krakow. I specialize in routes that reveal the city's rich history, traditions, and artistic heritage through its streets and landmarks.",
    title: "Cultural Heritage Guide",
    location: "Krakow",
    stats: {
      routesCreated: 16,
      followers: 945,
      following: 82
    },
    routes: [
      {
        id: 1,
        title: "Krakow Cultural Trail",
        image: "/images/Hidden Montmartre Walk.png",
        duration: "4 hours",
        distance: "5.1 km",
        likes: 567
      }
    ]
  },
  'takashi-yamamoto': {
    username: "takashiyamamoto",
    name: "Takashi Yamamoto",
    image: "/images/Local 5.jpg",
    bio: "Night photography expert in Tokyo. My routes showcase the city's stunning nightscape, from neon-lit streets to peaceful evening spots perfect for photography.",
    title: "Night Photography Expert",
    location: "Tokyo",
    stats: {
      routesCreated: 19,
      followers: 1623,
      following: 134
    },
    routes: [
      {
        id: 1,
        title: "Tokyo Night Lights",
        image: "/images/Tokyo Twilight.png",
        duration: "3 hours",
        distance: "3.6 km",
        likes: 892
      }
    ]
  },
  'sophie-laurent': {
    username: "sophielaurent",
    name: "Sophie Laurent",
    image: "/images/svessikriss_Tokyo_street_Photography_Canon_EOS_90D_with_a_Canon_91cff273-49ba-4851-a512-123c136ded98.png",
    bio: "Street life curator and photographer in Paris. My routes blend artistic spots, street photography opportunities, and authentic Parisian experiences.",
    title: "Street Life Curator",
    location: "Paris",
    stats: {
      routesCreated: 22,
      followers: 1847,
      following: 167
    },
    routes: [
      {
        id: 1,
        title: "Romantic Evening in Paris",
        image: "/images/Le Marais Sunset Start.jpg",
        duration: "2.5 hours",
        distance: "3.2 km",
        likes: 847
      },
      {
        id: 2,
        title: "Artistic Paris Walk",
        image: "/images/Pont des Arts.jpg",
        duration: "3.5 hours",
        distance: "4.2 km",
        likes: 934
      }
    ]
  }
};

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // Get the username from the URL params
  const { username } = await params;
  
  // Find the profile data for this username
  const profile = Object.values(profilesData).find(
    profile => profile.username.toLowerCase() === username.toLowerCase() ||
               profile.username.toLowerCase().replace('-', '') === username.toLowerCase()
  );
  
  // If no profile is found, show 404
  if (!profile) {
    notFound();
  }

  return (
    <Container>
      <Content>
        <ProfileSection>
          <ProfileImage>
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </ProfileImage>
          
          <h1 className="text-2xl font-bold text-gray-100">{profile.name}</h1>
          <p className="text-[#4CAF50] mt-2">{profile.title}</p>
          <p className="flex items-center justify-center gap-2 text-gray-400 mt-2">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </p>
          <p className="mt-4 max-w-2xl text-gray-400">{profile.bio}</p>

          <Stats>
            <StatItem>
              <StatValue>{profile.stats.routesCreated}</StatValue>
              <StatLabel>Routes Created</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.stats.followers}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.stats.following}</StatValue>
              <StatLabel>Following</StatLabel>
            </StatItem>
          </Stats>
        </ProfileSection>

        <TabsContainer>
          <Tab active>Popular Routes</Tab>
          <Tab>Recent Routes</Tab>
          <Tab>Saved Routes</Tab>
        </TabsContainer>

        <RoutesGrid>
          {profile.routes.map(route => (
            <RouteCard key={route.id} href={`/routes/${route.id}`}>
              <RouteImage>
                <Image
                  src={route.image}
                  alt={route.title}
                  fill
                  className="object-cover"
                />
              </RouteImage>
              <RouteContent>
                <h3 className="font-semibold text-gray-100">{route.title}</h3>
                <RouteStats>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {route.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {route.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {route.likes}
                  </span>
                </RouteStats>
              </RouteContent>
            </RouteCard>
          ))}
        </RoutesGrid>
      </Content>
    </Container>
  );
} 