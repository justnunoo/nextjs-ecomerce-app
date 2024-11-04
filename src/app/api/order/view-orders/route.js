import prisma from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // Check if the user is authenticated
    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        // Verify the JWT token and extract the userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Fetch all orders for the authenticated user
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: true, // Assumes a relation to the Product model for details
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Orders by the most recent first
            },
        });

        // Check if orders exist for the user
        if (!orders || orders.length === 0) {
            return new Response(JSON.stringify({ message: "No orders found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Return orders in JSON format
        return new Response(JSON.stringify({ orders }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ message: "Error fetching orders" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
