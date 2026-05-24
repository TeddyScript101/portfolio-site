import HomeClient from '@/components/HomeClient';
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/lib/baseUrl';

export default async function Home() {
  const baseUrl = getBaseUrl();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const res = await fetch(`${baseUrl}/api/profile`, {
      headers: {
        cookie: cookieHeader
      },
      cache: 'no-cache'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const profileData = await res.json();
    return <HomeClient profileData={profileData} />;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return <div>Error loading profile.</div>;
  }
}
