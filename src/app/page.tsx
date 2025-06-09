import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/profile`, { cache: 'no-cache' });

  const profileData = await res.json();

  return <HomeClient profileData={profileData} />;
}
