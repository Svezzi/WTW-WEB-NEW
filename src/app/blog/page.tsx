'use client';

import { Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

const posts: Post[] = [
  {
    id: 1,
    title: '10 Hidden Gems in Paris You Need to Visit',
    excerpt: 'Discover the secret spots in Paris that most tourists never see, from hidden cafés to secret gardens.',
    image: 'https://picsum.photos/id/1019/800/400',
    date: '2024-02-14',
    category: 'Travel Tips',
    author: {
      name: 'Sophie Martin',
      avatar: 'https://picsum.photos/id/1027/100/100'
    }
  },
  {
    id: 2,
    title: 'A Food Lover\'s Guide to Tokyo',
    excerpt: 'From street food to Michelin-starred restaurants, explore Tokyo\'s incredible culinary scene.',
    image: 'https://picsum.photos/id/1020/800/400',
    date: '2024-02-13',
    category: 'Food & Drink',
    author: {
      name: 'Takashi Yamamoto',
      avatar: 'https://picsum.photos/id/1028/100/100'
    }
  },
  {
    id: 3,
    title: 'Best Photography Spots in New York',
    excerpt: 'A photographer\'s guide to capturing the most Instagram-worthy shots in NYC.',
    image: 'https://picsum.photos/id/1021/800/400',
    date: '2024-02-12',
    category: 'Photography',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://picsum.photos/id/1029/100/100'
    }
  }
];

const categories = [
  { name: 'Travel Tips', count: 24 },
  { name: 'Food & Drink', count: 18 },
  { name: 'Photography', count: 12 },
  { name: 'Culture', count: 15 },
  { name: 'Adventure', count: 9 },
  { name: 'Local Guides', count: 21 }
];

const Sidebar = () => (
  <div className="space-y-8">
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[#1B4965]">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={`/blog/category/${category.name.toLowerCase()}`}
              className="flex items-center justify-between text-sm text-gray-600 hover:text-[#4CAF50]"
            >
              <span>{category.name}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg bg-[#1B4965] p-6 text-white">
      <h3 className="mb-2 text-lg font-semibold">Newsletter</h3>
      <p className="mb-4 text-sm text-gray-200">
        Get the latest travel tips and insights delivered to your inbox.
      </p>
      <input
        type="email"
        placeholder="Your email address"
        className="mb-3 w-full rounded-md border-0 bg-white/10 px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
      />
      <button className="w-full rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white hover:bg-[#45a049]">
        Subscribe
      </button>
    </div>
  </div>
);

export default function BlogPage() {
  return (
    <ContentLayout
      sidebar={<Sidebar />}
      breadcrumbs={[{ label: 'Blog', href: '/blog' }]}
    >
      {/* Featured Post */}
      <div className="mb-12">
        <Link
          href={`/blog/${posts[0].id}`}
          className="group block overflow-hidden rounded-lg bg-white shadow-sm"
        >
          <div className="relative h-[400px]">
            <Image
              src={posts[0].image}
              alt={posts[0].title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="mb-2 inline-block rounded-full bg-[#4CAF50] px-3 py-1 text-sm text-white">
                {posts[0].category}
              </span>
              <h1 className="mb-2 text-3xl font-bold text-white">{posts[0].title}</h1>
              <p className="text-gray-200">{posts[0].excerpt}</p>
              <div className="mt-4 flex items-center">
                <Image
                  src={posts[0].author.avatar}
                  alt={posts[0].author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{posts[0].author.name}</p>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(posts[0].date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Posts Grid */}
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.slice(1).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <span className="mb-2 inline-block rounded-full bg-[#F5F5F5] px-3 py-1 text-sm text-[#1B4965]">
                {post.category}
              </span>
              <h2 className="mb-2 text-xl font-bold text-[#1B4965]">{post.title}</h2>
              <p className="mb-4 text-sm text-gray-600">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-sm text-gray-600">{post.author.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-12 text-center">
        <button className="inline-flex items-center rounded-md bg-[#4CAF50] px-6 py-3 text-sm font-medium text-white hover:bg-[#45a049]">
          Load More Posts
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </ContentLayout>
  );
} 