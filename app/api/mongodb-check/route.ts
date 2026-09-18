import { NextResponse } from 'next/server';
import clientPromise, { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'MONGODB_URI environment variable is not configured.',
        instructions: [
          'Option 1 (Vercel Integration): Add MongoDB Atlas at https://vercel.com/marketplace/mongodbatlas and link it to this project.',
          'Option 2 (Local Development): Pull variables using `vercel env pull .env.local` or set MONGODB_URI in your .env.local file.'
        ]
      },
      { status: 500 }
    );
  }

  try {
    const client = await clientPromise;
    // Ping the admin database to verify the connection
    const pingResult = await client.db('admin').command({ ping: 1 });
    const db = await getDatabase();

    // List collections
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to MongoDB Atlas!',
      ping: pingResult,
      database: db.databaseName,
      collections: collections.map((col) => col.name)
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'connection_failed',
        error: error.message || 'Unknown error connecting to MongoDB Atlas',
        hint: 'Check that your MongoDB Atlas IP Access List allows 0.0.0.0/0 (or your current IP), and verify database credentials in MONGODB_URI.'
      },
      { status: 500 }
    );
  }
}

