Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /search
- /sign-in
- /cities
- /spots
- /blog
- /about

Page Implementations:
/search:
Core Purpose: Allow users to search for cities and spots with filters
Key Components
- SearchBar with autocomplete
- FilterPanel (price, rating, amenities)
- SearchResults grid

/list view toggle
- Map integration showing results
Layout Structure:
- Full-width search bar at top
- Filters sidebar (collapsible on mobile)
- Results area with grid

/sign-in:
Core Purpose: User authentication and account access
Key Components
- Login form
- Social login options
- Password recovery link
- Registration link
- Error messaging
Layout Structure
- Centered card layout
- Stacked form elements
- Responsive width (max 400px on desktop)

/cities:
Core Purpose: Browse and explore featured cities
Key Components
- City cards with images
- Quick stats (spots count, average rating)
- Search

/filter options
- Featured cities section
Layout Structure:
- Hero section with featured cities
- Grid layout for city cards
- Responsive grid (4-2-1 columns)
- Sticky filter header

/spots:
Core Purpose: Display all available spots across cities
Key Components
- Spot cards with images
- Advanced filtering system
- Sorting options
- Map view toggle
Layout Structure
- Filter bar at top
- Main content area with grid

/blog:
Core Purpose: Share travel content and updates
Key Components
- Article cards
- Category filters
- Featured posts section
- Newsletter signup
Layout Structure
- Featured post hero
- Content grid
- Sidebar with categories
- Responsive layout (sidebar moves to bottom on mobile)

/about:
Core Purpose: Company information and mission
Key Components
- Mission statement
- Team section
- Contact form
- Company timeline
Layout Structure
- Full-width hero section
- Alternating content sections
- Team grid
- Responsive spacing and typography

Layouts:
MainLayout:
- Applicable routes: all except /sign-in
- Core components
  - Header with navigation
  - Footer with site links
  - Notification system
- Responsive behavior
  - Collapsible menu on mobile
  - Adjusted padding/margins
  - Flexible content width

AuthLayout
- Applicable routes: /sign-in
- Core components
  - Minimal header
  - Centered content
  - Brand elements
- Responsive behavior
  - Full-screen on mobile
  - Maintained center alignment
  - Adjusted form width

ContentLayout
- Applicable routes: /blog, /about
- Core components
  - Content wrapper
  - Sidebar (where applicable)
  - Breadcrumbs
- Responsive behavior
  - Stack layout on mobile
  - Adjusted typography
  - Flexible content width
</page-structure-prompt>