'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sverrir Kristjansson',
    role: 'CEO & Founder',
    image: '/images/DSCF3784-3 3.JPG',
    bio: 'Passionate about connecting people with authentic local experiences and making cities more walkable.'
  },
  {
    name: 'Emily Chen',
    role: 'Head of Community',
    image: 'https://picsum.photos/id/1028/400/400',
    bio: 'Building bridges between locals and travelers to create meaningful connections.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Lead Route Curator',
    image: 'https://picsum.photos/id/1029/400/400',
    bio: 'Expert in discovering and curating the most unique walking experiences.'
  },
  {
    name: 'Sophie Martin',
    role: 'Content Director',
    image: 'https://picsum.photos/id/1030/400/400',
    bio: 'Storyteller focused on bringing local perspectives to life.'
  }
];

const timeline = [
  {
    year: '2024',
    title: 'WALK THIS WAY Founded',
    description: 'Founded with a mission to transform how people explore cities on foot.'
  },
  {
    year: '2024',
    title: 'Platform Launch',
    description: 'Launched our platform with curated walking routes in major European cities.'
  },
  {
    year: '2024',
    title: 'Community Growth',
    description: 'Building a community of local route creators and urban explorers.'
  }
];

export default function AboutPage() {
  return (
    <ContentLayout
      breadcrumbs={[{ label: 'About', href: '/about' }]}
    >
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full overflow-hidden rounded-xl">
        <Image
          src="/images/Skyline.png"
          alt="About hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            Rediscover Cities on Foot
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            We're creating a world where every street tells a story and every walk becomes an adventure.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mt-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="mt-4 text-gray-300">
              At WALK THIS WAY, we believe that the best way to experience a city is by walking its streets. Our platform is designed to connect urban explorers with authentic local experiences, making it easier than ever to discover the hidden gems and stories that make each city unique.
            </p>
            <p className="mt-4 text-gray-300">
              We work with passionate locals who share their insider knowledge and favorite routes, ensuring that every walk is more than just a journey from A to B – it's an immersive experience that reveals the true character of a city.
            </p>
          </div>
          <div className="relative h-64 overflow-hidden rounded-lg lg:h-auto">
            <Image
              src="/images/Secret Garden Path.jpg"
              alt="Our mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-white">Our Journey</h2>
        <div className="mt-8">
          {timeline.map((item, index) => (
            <div
              key={item.year}
              className="flex gap-8 pb-8 last:pb-0"
            >
              <div className="relative flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4400] text-lg font-bold text-white">
                  {item.year}
                </div>
                {index !== timeline.length - 1 && (
                  <div className="absolute top-12 h-full w-0.5 bg-gray-800" />
                )}
              </div>
              <div className="flex-1 pt-1.5">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-white">Meet Our Team</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded-lg bg-[#1F2937] p-6 border border-gray-800"
            >
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-sm text-[#FF4400]">{member.role}</p>
                <p className="mt-2 text-sm text-gray-300">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-16">
        <div className="rounded-lg bg-[#1F2937] p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
          <p className="mt-2 text-gray-300">
            Have questions or want to collaborate? We'd love to hear from you.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#111827] px-3 py-2 text-white shadow-sm focus:border-[#FF4400] focus:outline-none focus:ring-1 focus:ring-[#FF4400]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#111827] px-3 py-2 text-white shadow-sm focus:border-[#FF4400] focus:outline-none focus:ring-1 focus:ring-[#FF4400]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#111827] px-3 py-2 text-white shadow-sm focus:border-[#FF4400] focus:outline-none focus:ring-1 focus:ring-[#FF4400]"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-[#FF4400] px-6 py-2 text-sm font-medium text-white hover:bg-[#E63E00]"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-[#FF4400]" />
                    <span className="ml-3 text-gray-300">
                      Reykjavík, Iceland
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-[#FF4400]" />
                    <span className="ml-3 text-gray-300">contact@walkthisway.com</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Follow Us</h3>
                <p className="mt-2 text-gray-300">
                  Join our community of urban explorers and local guides on social media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContentLayout>
  );
} 