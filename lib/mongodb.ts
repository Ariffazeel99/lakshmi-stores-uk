import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    return Promise.reject(
      new Error('MONGODB_URI environment variable is not defined. Please configure it in .env.local or Vercel project settings.')
    );
  }
  const currentUri = rawUri.trim().replace(/^["']|["']$/g, '');

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(currentUri, options);
      attachDatabasePool(client);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    const client = new MongoClient(currentUri, options);
    attachDatabasePool(client);
    return client.connect();
  }
}

// Lazy client promise so imports don't trigger unhandled promise rejections at build time
const clientPromise: Promise<MongoClient> = {
  then(...args) {
    return getClientPromise().then(...args);
  },
  catch(...args) {
    return getClientPromise().catch(...args);
  },
  finally(...args) {
    return getClientPromise().finally(...args);
  },
  [Symbol.toStringTag]: 'Promise'
} as Promise<MongoClient>;

/**
 * Helper to get the MongoDB database instance.
 * Defaults to the database specified in the connection string or 'lakshmi_stores'.
 */
export async function getDatabase(dbName?: string) {
  const connectedClient = await getClientPromise();
  return connectedClient.db(dbName || 'lakshmi_stores');
}

export default clientPromise;
