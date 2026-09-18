import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/dal/users';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    return NextResponse.json({
      success: true,
      user
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}

