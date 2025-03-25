import { redirect } from 'next/navigation';

export default function RoutesPage() {
  redirect('/search?featured=true');
} 