import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized user action, please log in" }), { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId

        const favorites = await prisma.favorites.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                product: {
                    select: {
                        productId: true,
                        name: true,
                        mainImage: true,
                        price: true
                    }
                }
            }
        })

        if (!favorites) {
            return new Response(JSON.stringify({ error: "No favorites found" }), { status: 404 })
        }

        return new Response(JSON.stringify({ favorites }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200
        })
    }
    catch (error) {
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
    }
}