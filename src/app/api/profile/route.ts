import { NextResponse } from 'next/server';

import clientPromise from '@/lib/mongo';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('portfolio-site');
        const collection = db.collection('profiles');

        const profileData = await collection.findOne({});

        if (!profileData) {
            return NextResponse.json({ error: 'Profile data not found' }, { status: 404 });
        }

        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Failed to fetch profile data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

