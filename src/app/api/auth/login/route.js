import prisma from "@/lib/db";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function POST(req) {
    // console.log("body data", await req.json());

    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 200 })
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
        return new Response(JSON.stringify({ message: "Incorrect password" }), { status: 200 })
    }

    // Sign the JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });
    console.log("Token is ", token)

    // Set the token in a cookie
    const cookieStore = cookies();
    cookieStore.set('token', token, { httpOnly: true, maxAge: 60 * 60 }); // Expires in 1 hour

    return new Response(JSON.stringify({ token }), { status: 200 });
}