import prisma from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = parseInt(searchParams.get("productId"));

        if (!productId) {
            return new Response(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
        }

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Correctly use the composite key with `userId_productId`
        const favorite = await prisma.favorites.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        return new Response(JSON.stringify({ isFavorite: Boolean(favorite) }), {
            status: 200
        });
    }
    catch (error) {
        console.error("Error in /api/favorites/check:", error); // Logs the error
        return new Response(JSON.stringify({ error: "Error fetching favorite status" }), {
            status: 500
        });
    }
}
