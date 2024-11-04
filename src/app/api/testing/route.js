import prisma from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // Check if the user is authenticated
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Verify the JWT token and extract the userId and email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const userEmail = decoded.email;

        // Fetch the user's cart with associated items and products
        const userCart = await prisma.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    include: {
                        product: true, // Include product details to access price
                    },
                },
            },
        });

        // Check if the cart is empty
        if (!userCart || userCart.items.length === 0) {
            return new Response(JSON.stringify({ message: "Cart is empty", cartEmpty: true }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Calculate the total amount for the order
        const totalAmount = userCart.items.reduce(
            (sum, item) => sum + (item.quantity * item.product.price), 0
        );

        // Create the order and associated order items
        const orderDetails = await prisma.order.create({
            data: {
                userId: userId,
                status: "PENDING", // You can adjust this based on your logic
                totalAmount: totalAmount,
                orderItems: {
                    create: userCart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                        priceAtTime: item.product.price, // Price at the time of the order
                    })),
                },
            },
            include: { orderItems: { include: { product: true } } }, // Include product details in the orderItems
        });

        // Send order confirmation email
        // await sendOrderConfirmationEmail(userEmail, orderDetails.orderItems);

        // Clear the user's cart after the order is placed
        await prisma.cartItem.deleteMany({
            where: { cartId: userCart.id },
        });

        // Optionally, reset cart updatedAt to reflect changes
        await prisma.cart.update({
            where: { id: userCart.id },
            data: { updatedAt: new Date() },
        });

        // Return a success response
        return new Response(JSON.stringify({ message: "Order placed successfully", orderDetails, cartEmpty: true }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 201,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return new Response(JSON.stringify({ message: "Error placing the order.", cartEmpty: false }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
