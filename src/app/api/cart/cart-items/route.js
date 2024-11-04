import prisma from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // Check if the user is authenticated
        if (!token) {
            redirect("/login")
            return new Response(JSON.stringify({
                success: false,
                message: "Unauthorized action, user must be logged in."
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Verify the token and decode userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userId;

        // Fetch user's cart from the database
        const userCart = await prisma.cart.findUnique({
            where: {
                userId: userID,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        // Check if cart exists and has items
        if (!userCart || userCart.items.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                message: "Your cart is empty",
                cartItems: [] // Return an empty array if there are no items
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Map cart items into a user-friendly structure
        const cartItems = userCart.items.map(item => ({
            id: item.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            color: item.selectedColor,
            size: item.selectedSize,
            productID: item.product.productId
        }));

        // Return the cart items with a success message
        return new Response(JSON.stringify({
            success: true,
            message: "Cart fetched successfully",
            cartItems
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        // Handle any errors that occur
        return new Response(JSON.stringify({
            success: false,
            message: "Error fetching cart items.",
            error: error.message // Optionally include the error message for debugging
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}