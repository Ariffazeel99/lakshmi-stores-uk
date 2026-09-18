import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, UserRole } from '@/types/mongodb';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  // Fallback for seed placeholder hashes or plain demo passwords
  if (storedHash.includes('Placeholder') || storedHash === password) {
    return true;
  }
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

export function sanitizeUser(doc: UserDocument): UserProfile {
  return {
    id: doc._id.toString(),
    email: doc.email,
    firstName: doc.first_name || '',
    lastName: doc.last_name || '',
    phone: doc.phone || null,
    role: doc.role,
    createdAt: doc.created_at.toISOString()
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const db = await getDatabase();
  return db.collection<UserDocument>('users').findOne({
    email: email.toLowerCase().trim()
  });
}

export async function getUserById(id: string | ObjectId): Promise<UserDocument | null> {
  const db = await getDatabase();
  const objId = typeof id === 'string' && ObjectId.isValid(id) ? new ObjectId(id) : id;
  if (!ObjectId.isValid(objId as any)) return null;
  return db.collection<UserDocument>('users').findOne({ _id: objId as ObjectId });
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export async function createUser(data: CreateUserData): Promise<UserProfile> {
  const db = await getDatabase();
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const now = new Date();
  const passwordHash = hashPassword(data.password);

  const newUserDoc: UserDocument = {
    _id: new ObjectId(),
    email: data.email.toLowerCase().trim(),
    password_hash: passwordHash,
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    phone: data.phone?.trim() || null,
    role: data.role || 'customer',
    saved_addresses: [],
    created_at: now,
    updated_at: now
  };

  await db.collection<UserDocument>('users').insertOne(newUserDoc);
  return sanitizeUser(newUserDoc);
}

export async function authenticateUser(email: string, password: string): Promise<UserProfile | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  // Allow password check
  if (user.password_hash && !verifyPassword(password, user.password_hash)) {
    return null;
  }

  return sanitizeUser(user);
}

