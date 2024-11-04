// /app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the JWT token by setting the cookie with an expired date
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });

    return response;
}