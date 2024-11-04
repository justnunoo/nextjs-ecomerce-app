import prisma from "@/lib/db";

export async function GET() {

    // Fetch 5 products excluding the one with the retrieved productId
    const products = await prisma.product.findMany({});

    // Shuffle the products (if needed)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledProducts = shuffleArray(products);

    const shuffledProducts2 = shuffleArray(shuffledProducts);

    const selectedProducts = []

    for (let i = 0; i < 4; i++) {
        selectedProducts.push(shuffledProducts2[i])
    }

    // Return the shuffled products as a response
    return new Response(JSON.stringify(selectedProducts), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 200
    });
}
