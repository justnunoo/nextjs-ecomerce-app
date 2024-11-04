// // /middleware.js
// import { NextResponse } from 'next/server';
// import { verifyJwtToken } from '@/lib/jwt';

// export async function middleware(req) {
//     const token = req.cookies.get('token')?.value;

//     if (!token) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     const isValid = verifyJwtToken(token);
//     if (!isValid) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/cart', '/order'],
// };


import { NextResponse } from 'next/server';

// Define the protected routes
const protectedRoutes = ['/cart', '/order'];

export function middleware(request) {
    // Get the user's token from cookies
    const token = request.cookies.get('token')?.value;

    // Check if the request path matches any protected routes
    const pathname = request.nextUrl.pathname;

    if (protectedRoutes.includes(pathname)) {
        // If the user is not logged in (no token found), redirect to the login page
        if (!token) {
            // Redirect to login page, passing the original destination as a query param
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname); // Optionally, add the redirect path to login query

            return NextResponse.redirect(loginUrl);
        }
    }

    // Continue the request if the user is logged in or if the route is not protected
    return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
    matcher: ['/cart', '/order'], // Define which routes to apply this middleware on
};
