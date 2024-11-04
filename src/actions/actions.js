"use server";

import prisma from "@/lib/db";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function handleAddToCart(formData) {
    const productId = parseInt(formData.get("productId"), 10);
    const selectedColor = formData.get("selectedColor");
    const selectedSize = formData.get("selectedSize");
    const quantity = parseInt(formData.get("quantity"), 10);

    // Ensure productId and quantity are valid
    if (isNaN(productId) || isNaN(quantity) || quantity <= 0) {
        return { success: false, message: "Invalid product or quantity." };
    }

    // Ensure selectedColor and selectedSize are provided
    if (selectedColor && selectedSize) {
        try {
            // Check if an existing cart item with the same product, color, and size exists
            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    productId: productId,
                    selectedColor: selectedColor,
                    selectedSize: selectedSize,
                    cartId: 1 // Assuming cartId is static or coming from the user session
                }
            });

            if (existingCartItem) {
                // If the item exists, update the quantity
                await prisma.cartItem.update({
                    where: { id: existingCartItem.id },
                    data: { quantity: existingCartItem.quantity + quantity }
                });
            } else {
                // If the item doesn't exist, create a new one
                await prisma.cartItem.create({
                    data: {
                        productId: productId,
                        selectedColor: selectedColor,
                        selectedSize: selectedSize,
                        quantity: quantity,
                        cartId: 1
                    }
                });
            }

            // Revalidate the cart page
            revalidatePath("/cart");

            return { success: true, message: "Cart updated successfully!" };

        } catch (error) {
            console.error("Error handling cart:", error);
            return { success: false, message: "An error occurred while updating the cart." };
        }
    } else {
        return { success: false, message: "Please select both color and size." };
    }
}

// export async function deleteFromCart(formData) {

//     const cartItemId = parseInt(formData.get("itemId"), 10);

//     const cookieStore = cookies();

//     const token = cookieStore.get("token")?.value

//     try {

//         if (!token) {
//             return new Response(JSON.stringify({ message: "Unauthorized useraction, please log in to continue" }))
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)

//         const currentUserId = decoded.userId

//         const userCart = await prisma.cart.findUnique({
//             where: {
//                 userId: currentUserId
//             }
//         })

//         if (!userCart) {
//             return new Response(JSON.stringify({ message: "Cart not found." }))
//         }

//         // Delete the cart item
//         await prisma.cartItem.delete({
//             where: {
//                 id: cartItemId,
//             }
//         });

//         // Revalidate the cart page
//         revalidatePath("/cart");

//         return { success: true, message: "Item removed from cart." };
//     } catch (error) {
//         console.error("Error deleting cart item:", error);
//         return { success: false, message: "An error occurred while removing the item." };
//     }
// }

// Example of deleteFromCart in server-side action


export const deleteFromCart = async ({ itemId }) => {
    try {
        await prisma.cartItem.delete({
            where: { id: itemId },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting item:", error);
        return { success: false };
    }
};



// export async function updateCartItem(formData) {
//     const cartItemId = parseInt(formData.get("cartItemId"), 10);
//     const selectedColor = formData.get("selectedColor");
//     const selectedSize = formData.get("selectedSize");
//     const quantity = parseInt(formData.get("quantity"), 10);

//     if (isNaN(quantity) || quantity <= 0) {
//         return { success: false, message: "Invalid product or quantity." };
//     }

//     if (selectedColor && selectedSize) {
//         try {
//             const cartItem = await prisma.cartItem.findUnique({
//                 where: {
//                     id: cartItemId
//                 }
//             })

//             if (!cartItem) {
//                 console.log("Cart item not found>")
//                 return new Response(JSON.stringify({ message: "Cart item not found." }))
//             }

//             await prisma.cartItem.update({
//                 where: {
//                     id: cartItemId
//                 },
//                 data: {
//                     selectedColor: selectedColor,
//                     selectedSize: selectedSize,
//                     quantity: quantity
//                 }
//             })

//             console.log("Item updated.")
//             // Revalidate the cart page
//             revalidatePath("/cart")

//             return new Response(JSON.stringify({ message: "Cart item has been updated" }), {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 status: 201
//             })
//         }
//         catch (error) {
//             console.error("Error updating cart item:", error);
//         }
//     }
//     else {
//         return new Response(JSON.stringify({ success: true, message: "Please select both color and size" }))

//     }
// }



export async function updateCartItem({ cartItemId, selectedColor, selectedSize, quantity }) {
    if (isNaN(quantity) || quantity <= 0) {
        return { success: false, message: "Invalid quantity." };
    }

    if (!selectedColor || !selectedSize) {
        return { success: false, message: "Please select both color and size." };
    }

    try {
        // Find the cart item by its ID
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId }
        });

        if (!cartItem) {
            return { success: false, message: "Cart item not found." };
        }

        // Update the cart item with new color, size, and quantity
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: {
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                quantity: quantity
            }
        });

        // Optionally, revalidate the cart page
        revalidatePath("/cart");

        return { success: true, type: "success", message: "Cart item updated successfully." };

    } catch (error) {
        console.error("Error updating cart item:", error);
        return { success: false, type: "danger", message: "Error updating cart item." };
    }
}


export async function placeOrder() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // Check if the user is authenticated
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Verify the JWT token and extract the userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

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
            return new Response(JSON.stringify({ message: "Cart is empty" }), {
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
        const order = await prisma.order.create({
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
        });

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
        return new Response(JSON.stringify({ message: "Order placed successfully", order }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 201,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return new Response(JSON.stringify({ message: "Error placing the order." }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}



// export const GetCartItemCount = async () => {
//     const cookieStore = cookies()
//     const token = cookieStore.get('token')?.value

//     try {
//         if (!token) {
//             return null
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const userId = decoded.userId

//         const userCart = await prisma.cart.findUnique({
//             where: {
//                 userId: userId
//             },
//             include: {
//                 items: true
//             }
//         })

//         if (!userCart) {
//             return 0
//         }

//         const cartCount = userCart.items.length

//         return cartCount
//     }
//     catch (error) {
//         return null
//     }

// }


export const handleAddToFavorite = async ({ productId }) => {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value
    // try {
    //     if (!token) {
    //         return null
    //     }
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //     const userId = decoded.userId
    //     const product = await prisma.product.findUnique({where: {id: productId}})
    //     if (!product) {
    //         return null
    //     }
    //     const existingFavorite = await prisma.favorite.findUnique({
    //         where: {
    //             userId : userId,
    //             productId: productId
    //         }
    //     })

    //     if (existingFavorite){
    //         await prisma.favorite.delete({
    //             where: {
    //                 userId : userId,
    //                 productId: productId
    //             }
    //         })
    //     }
    //     else{
    //         await prisma.favorite.create({
    //             data: {
    //                 userId : userId,
    //                 productId: productId
    //             }
    //         })
    //     }
    // }
    // catch (error) {
    //     console.error(error)
    //     return null
    // }
    console.log("Product Id : ", productId)
    return `${productId} added to cart`
}