import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const res = await fetch('/api/profile', { cache: 'no-cache' });
  const profileData = await res.json();

  return <HomeClient profileData={profileData} />;
}
