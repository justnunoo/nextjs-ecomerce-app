import prisma from "@/lib/db";

export async function GET(req, { params }) {
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
                productId: productID,
            },
            select: {
                name: true,
                price: true,
                productId: true,
                mainImage: true
            }
        });

        // If the product is not found, return a 404 response
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 404
            });
        }

        // Return the product data as a JSON response
        return new Response(JSON.stringify(product), {
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
