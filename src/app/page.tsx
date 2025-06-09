import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const endpoint = process.env.PROFILE_API_ENDPOINT;
  if (!endpoint) {
    throw new Error('PROFILE_API_ENDPOINT environment variable is not set');
  }

  const res = await fetch(endpoint, { cache: 'no-cache' });
  const profileData = await res.json();

  return <HomeClient profileData={profileData} />;
}
