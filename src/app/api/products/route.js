import prisma from "@/lib/db";

export async function GET(req, { params }) {
    const products = await prisma.product.findMany()

    return new Response(JSON.stringify(products),
        {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200
        })

}