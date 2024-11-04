import prisma from "@/lib/db";
import ShoeCardComponent from "@/components/shoeCard/shoeCard";
import Link from "next/link";
import ToggleFavoriteComponent from "@/components/toggle-favorite/toggleFavorite";

export const dynamic = "force-dynamic";

// This function runs server-side
export default async function SearchPage({ searchParams }) {
    const query = searchParams.query || ""; // Get the search query from the URL

    try {
        // Fetch the search results on the server side
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            // mode: "insensitive", // Case-insensitive search
                        },
                    },
                    {
                        brand: {
                            contains: query,
                            // mode: "insensitive", // Case-insensitive search
                        },
                    },
                ],
            },
            select: {
                productId: true,
                name: true,
                mainImage: true,
                price: true
            }
        });

        return (
            <div className="container">
                <h1>Search results for <b style={{ fontStyle: "italic" }}>{query}</b></h1>

                <div className="row">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <ToggleFavoriteComponent productId={product.productId} />
                                <Link href={`/product-detail/${product.productId}`}>
                                    <ShoeCardComponent
                                        name={product.name}
                                        image={product.mainImage}
                                        price={product.price}
                                    />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No products found for <b>{query}</b></p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return (
            <div className="container">
                <h1>Search results for <b style={{ fontStyle: "italic" }}>{query}</b></h1>
                <p>An error occurred while fetching the products. Please try again later.</p>
            </div>
        );
    }
}
