import HomeClient from '@/components/HomeClient';
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/lib/baseUrl';

export default async function Home() {
  const baseUrl = getBaseUrl();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const headers = { cookie: cookieHeader };

  try {
    const [profileRes, projectsRes] = await Promise.all([
      fetch(`${baseUrl}/api/profile`, { headers, cache: 'no-cache' }),
      fetch(`${baseUrl}/api/projects`, { headers, cache: 'no-cache' }),
    ]);

    if (!profileRes.ok) {
      throw new Error(`Failed to fetch profile: ${profileRes.status} ${profileRes.statusText}`);
    }

    const profileData = await profileRes.json();
    const projects = projectsRes.ok ? await projectsRes.json() : [];

    return <HomeClient profileData={profileData} projects={projects} />;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return <div>Error loading profile.</div>;
  }
}
