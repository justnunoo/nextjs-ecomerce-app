import ShoeCardComponent from "@/components/shoeCard/shoeCard";
import prisma from "@/lib/db"
import { Container } from "react-bootstrap";
import Link from "next/link";
import ToggleFavoriteComponent from "@/components/toggle-favorite/toggleFavorite";


export default async function Page({ params }) {
    const brandName = decodeURIComponent(params.name)

    const products = await prisma.product.findMany({
        where: {
            brand: brandName
        },
        select: {
            productId: true,
            name: true,
            price: true,
            mainImage: true
        }
    })

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div>
            <h1 className="text-center mb-3 mt-3">{capitalize(brandName)}</h1>
            <Container>
                <div className="row">
                    {
                        products.map((product, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 product-card">

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
                    }
                </div>
            </Container>
        </div>
    )
}