import HomeClient from '@/components/HomeClient';

export default async function Home() {
  try {
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';


    console.log(`Base URL: ${baseUrl}`);
    const res = await fetch(`${baseUrl}/api/profile`, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const profileData = await res.json();
    return <HomeClient profileData={profileData} />;

  } catch (error) {
    console.error('Error fetching profile data:', error);
    return
  }
}