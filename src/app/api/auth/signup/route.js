import { hash } from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req) {
    const { email, username, password } = await req.json()

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existingUser) {
        return new Response(JSON.stringify({ message: "User already exists." }), { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword
        }
    })

    return new Response(JSON.stringify({ message: "User successfully registered" }), { status: 201 })
}