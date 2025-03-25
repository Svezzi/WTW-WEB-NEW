import Image from 'next/image';
import Link from 'next/link';

export default function BecomeCreator() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center bg-[#0F172A]">
        <Image
          src="/images/city-explorer.jpg"
          alt="City Explorer"
          fill
          className="object-cover brightness-25 mix-blend-overlay"
          priority
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Share Your City's Story</h1>
          <p className="text-xl text-white mb-8 font-medium">
            Every street has a story, every neighborhood a hidden gem. As a Route Creator, 
            you'll help others discover the heart and soul of your city.
          </p>
          <Link 
            href="#get-started"
            className="inline-block bg-[#4CAF50] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#45a049] transition-colors shadow-lg"
          >
            Start Creating Your Routes
          </Link>
        </div>
      </div>

      {/* What You'll Be Doing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#0F172A] text-center mb-16">What You'll Be Doing</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#4CAF50]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Design Unique Routes</h3>
              <p className="text-gray-700">
                Create walking routes that showcase your city's best spots, hidden gems, and local favorites.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#4CAF50]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Share Your Knowledge</h3>
              <p className="text-gray-700">
                Add insider tips, photos, and stories that bring each location to life.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#4CAF50]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Join the Community</h3>
              <p className="text-gray-700">
                Connect with other Route Creators and inspire urban exploration worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#0F172A] text-center mb-16">Why Join?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/community.jpg"
                alt="Community of Route Creators"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#4CAF50] mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-lg text-[#0F172A]">Share your unique perspective and help others discover your city's magic</p>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#4CAF50] mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-lg text-[#0F172A]">Join a global community of passionate urban explorers</p>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#4CAF50] mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-lg text-[#0F172A]">Turn your city expertise into something valuable – we're building ways for Route Creators to earn from their contributions</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#0F172A] text-center mb-8">Ready to Start?</h2>
          <p className="text-center text-gray-700 text-lg mb-12">
            Join our community of Route Creators and start sharing your favorite city spots with the world!
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#0F172A] mb-1">Your City</label>
              <input
                type="text"
                id="city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Where are you based?"
              />
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-[#0F172A] mb-1">Tell us about your favorite spots</label>
              <textarea
                id="about"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Share a bit about your favorite places in your city..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#45a049] transition-colors shadow-lg"
            >
              Join as a Route Creator
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#0F172A] text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">Do I need experience?</h3>
              <p className="text-gray-700">
                Not at all! If you're passionate about your city and love exploring, you're already qualified.
                We provide all the tools and support you need to create great routes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">Do I have to create routes regularly?</h3>
              <p className="text-gray-700">
                Create at your own pace! Whether you want to share one perfect route or create new ones every week,
                it's entirely up to you. Quality matters more than quantity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">Can I make money from this?</h3>
              <p className="text-gray-700">
                We're developing ways for Route Creators to earn from their contributions. While we're still working
                out the details, our goal is to reward great content that helps others discover amazing places.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 