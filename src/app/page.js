import prisma from "@/lib/db";
import ShoeCardComponent from "@/components/shoeCard/shoeCard";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ToggleFavoriteComponent from "@/components/toggle-favorite/toggleFavorite";

export default async function Home() {
  // Fetching product data from the database using Prisma
  const products = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      mainImage: true,
      productId: true
    }
  });

  revalidatePath("/");

  // Shuffle the product array to randomize display order
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Swapping the elements
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);  // Shuffle the fetched products

  return (
    <div className="container mt-3">
      <div className="row">
        {shuffledProducts.map((product, index) => (
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
        ))}
      </div>
    </div>
  );
}