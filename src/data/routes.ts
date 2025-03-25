export interface Route {
  id: string;
  title: string;
  description: string;
  image: string;
  city: string;
  creator: {
    name: string;
    image: string;
    title: string;
  };
  duration: string;
  distance: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  stops: number;
  rating: number;
  reviews: number;
}

export const routes: Route[] = [
  {
    id: 'romantic-evening-in-paris',
    title: 'Romantic Evening in Paris',
    description: 'Experience the magic of Paris at night with this romantic walking route through the city\'s most enchanting spots.',
    image: '/images/RomanticEveningInParis.png',
    city: 'Paris',
    creator: {
      name: 'Sophie Laurent',
      image: '/images/Local 7.jpg',
      title: 'Street Life Curator'
    },
    duration: '3 hours',
    distance: '4.2 km',
    difficulty: 'Easy',
    stops: 8,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'tokyo-twilight',
    title: 'Tokyo Twilight',
    description: 'Discover the vibrant energy of Tokyo\'s nightlife with this carefully curated route through the city\'s most exciting districts.',
    image: '/images/TokyoTwilight.png',
    city: 'Tokyo',
    creator: {
      name: 'Takashi Yamamoto',
      image: '/images/Local 5.jpg',
      title: 'Night Photography Expert'
    },
    duration: '4 hours',
    distance: '5.5 km',
    difficulty: 'Moderate',
    stops: 10,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'kreuzberg-chronicles',
    title: 'Kreuzberg Chronicles',
    description: 'Explore Berlin\'s most creative district with this route that takes you through street art, alternative culture, and local hotspots.',
    image: '/images/KreuzbergChronicles.png',
    city: 'Berlin',
    creator: {
      name: 'Anna Kowalsky',
      image: '/images/Umbella-Street.jpg',
      title: 'Cultural Heritage Guide'
    },
    duration: '3.5 hours',
    distance: '4.8 km',
    difficulty: 'Easy',
    stops: 9,
    rating: 4.7,
    reviews: 156
  }
];

export default routes; 