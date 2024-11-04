import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req, { params }) {

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value

    // Parse the product ID from the params and check if it's a valid number
    const productID = parseInt(params.id, 10);

    if (isNaN(productID)) {
        return new Response(JSON.stringify({ error: "Invalid product ID" }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 400 // Bad Request
        });
    }

    try {

        // Fetch the product with the provided ID
        const product = await prisma.product.findUnique({
            where: {
                // productId: productID,
                productId: productID
            },
        });

        // if (!token) {
        //     return new Response(JSON.stringify({ logged_in: false, product }))
        // }

        // If the product is not found, return a 404 response
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 404
            });
        }


        console.log(product)

        // Return the product data as a JSON response
        return new Response(JSON.stringify({ logged_in: !!token, product }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200
        });
    } catch (error) {
        // Handle any unexpected errors during the Prisma query
        console.error("Error fetching product:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500 // Internal Server Error
        });
    }
}


// export async function GET(req, { params }) {
//     const cookieStore = cookies();
//     const token = cookieStore.get('token')?.value;

//     const productID = parseInt(params.id, 10);

//     if (isNaN(productID)) {
//         return new Response(JSON.stringify({ error: "Invalid product ID" }), {
//             headers: { 'Content-Type': 'application/json' },
//             status: 400,
//         });
//     }

//     try {
//         if (!token) {
//             return new Response(JSON.stringify({ logged_in: false }), {
//                 headers: { 'Content-Type': 'application/json' },
//                 status: 401,
//             });
//         }

//         const product = await prisma.product.findUnique({
//             where: { productId: productID },
//         });

//         if (!product) {
//             return new Response(JSON.stringify({ error: "Product not found" }), {
//                 headers: { 'Content-Type': 'application/json' },
//                 status: 404,
//             });
//         }

//         return new Response(JSON.stringify({ logged_in: true, product }), {
//             headers: { 'Content-Type': 'application/json' },
//             status: 200,
//         });
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//             headers: { 'Content-Type': 'application/json' },
//             status: 500,
//         });
//     }
// }
