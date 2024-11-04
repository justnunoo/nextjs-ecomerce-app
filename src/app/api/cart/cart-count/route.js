import prisma from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const GET = async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    try {
        if (!token) {
            return new Response(JSON.stringify({ cartItemCount: 0 }), {
                status: 401,
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.userId

        const userCart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                items: true
            }
        })

        if (!userCart) {
            return new Response(JSON.stringify({ cartItemCount: 0 }))
        }

        const cartItemCount = userCart.items.length

        console.log(cartItemCount)

        return new Response(JSON.stringify({ cartItemCount }), {
            headers: {
                "Content-type": "application/json"
            },
            status: 201
        })
    }
    catch (error) {
        return new Response(JSON.stringify({ message: "Error returning cart count." }), {
            headers: {
                "Content-Type": "application/json"
            },

            status: 500
        })
    }

}