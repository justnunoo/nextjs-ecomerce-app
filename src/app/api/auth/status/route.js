import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Import cookies from Next.js headers API

export async function GET(req) {
    const cookieStore = cookies(); // Get cookies from the request headers
    const token = cookieStore.get('token')?.value; // Get token from the cookie

    try {
        if (!token) {
            console.log("No token");
            // Return a valid JSON response
            return new Response(JSON.stringify({ authenticated: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token available");

        // Return a valid JSON response with user data
        return new Response(JSON.stringify({ authenticated: true, user: decoded }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Catch any errors, return authenticated: false
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
