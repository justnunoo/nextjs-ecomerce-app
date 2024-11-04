import jwt from 'jsonwebtoken';
import prisma from "@/lib/db"; // Import Prisma client
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function POST(request) {

    // Get the token from cookies (adjust this according to how your token is stored)
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    try {

        if (!token) {
            redirect("/login")
            return new Response(JSON.stringify({ success: false, message: "User not authenticated" }), { status: 401 });
        }

        // Parse the form data from the request
        const formData = await request.formData();

        const productId = parseInt(formData.get("productId"), 10);
        const selectedColor = formData.get("selectedColor");
        const selectedSize = formData.get("selectedSize");
        const quantity = parseInt(formData.get("quantity"), 10);

        if (!productId || !selectedColor || !selectedSize || isNaN(quantity)) {
            return new Response(JSON.stringify({ success: false, message: "Invalid form data" }), { status: 400 });
        }





        // Verify the token and get the user info
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Assuming the user ID is in the JWT payload

        // Check if the user already has a cart
        let cart = await prisma.cart.findFirst({
            where: {
                userId: userId,
                // status: 'active' // Assuming 'active' means an ongoing cart
            }
        });

        if (!cart) {
            // If no active cart exists, create one
            cart = await prisma.cart.create({
                data: {
                    userId: userId,
                    // status: 'active' // Create a new active cart
                }
            });
        }

        // Check if the cart item with the same productId, selectedColor, and selectedSize exists in the cart
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                productId: productId,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                cartId: cart.id // Use the user's cart ID
            }
        });

        if (existingCartItem) {
            // If the item already exists, update the quantity
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            });

            // Return a success response with a message
            return new Response(JSON.stringify({ success: true, message: "Quantity updated in Cart!" }), { status: 200 });
        } else {
            // If the item doesn't exist, create a new cart item
            await prisma.cartItem.create({
                data: {
                    productId: productId,
                    selectedColor: selectedColor,
                    selectedSize: selectedSize,
                    quantity: quantity,
                    cartId: cart.id // Use the user's cart ID
                }
            });

            // Return a success response with a message
            return new Response(JSON.stringify({ success: true, message: "Item added to cart!" }), { status: 200 });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return new Response(JSON.stringify({ success: false, message: "An error occurred." }), { status: 500 });
    }
}
