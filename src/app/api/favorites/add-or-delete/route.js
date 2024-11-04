import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
    const { productId } = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized user action, please login." }), {
            status: 401
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Check if the favorite already exists
        const existingFavorite = await prisma.favorites.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        // If it exists, delete it (removes from favorites)
        if (existingFavorite) {
            await prisma.favorites.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });
            return new Response(JSON.stringify({ message: "Product removed from favorites.", isFavorite: false }), {
                status: 200
            });
        }
        // Otherwise, add it to favorites
        else {
            await prisma.favorites.create({
                data: {
                    userId,
                    productId
                }
            });
            return new Response(JSON.stringify({ message: "Product added to favorites.", isFavorite: true }), {
                status: 200
            });
        }
    }
    catch (error) {
        console.error("Error in /api/favorites/add-or-delete:", error); // Logs the exact error for debugging
        return new Response(JSON.stringify({ error: "Error toggling favorite." }), { status: 500 });
    }
}
