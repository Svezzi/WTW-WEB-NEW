'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CreateRoute component with SSR disabled
const CreateRoute = dynamic(
  () => import('@/components/features/CreateRoute'),
  { ssr: false } // Disable SSR since Google Maps needs window object
);

export default function CreateRoutePage() {
  return (
    <div className="h-screen w-full">
      <CreateRoute />
    </div>
  );
} 