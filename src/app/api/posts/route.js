import prisma from "@/lib/db";

export async function GET(req) {

    const posts = await prisma.post.findMany();

    return new Response(JSON.stringify(posts), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    });
}
