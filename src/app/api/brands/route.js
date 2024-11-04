import prisma from "@/lib/db";

export async function GET(req, { params }) {
    const distinctBrands = await prisma.product.findMany(
        {
            distinct: ['brand'],
            select: {
                brand: true
            }
        }
    )

    return new Response(JSON.stringify(distinctBrands),
        {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200
        })

}