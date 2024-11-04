"use client";

import { useEffect, useState } from "react";
import styles from "./favoritesPage.module.css"; // Optional styling file
import Link from "next/link"; // If you want to link to individual product pages
import ShoeCardComponent from "@/components/shoeCard/shoeCard";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the favorite products data on component mount
        const fetchFavorites = async () => {
            try {
                const response = await fetch("/api/favorites/view-favorites");

                if (!response.ok) {
                    throw new Error("Failed to fetch favorites");
                }

                const data = await response.json();
                setFavorites(data.favorites);  // favorites is an array here
            } catch (error) {
                setError("Error fetching favorites.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <p>Loading favorites...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.favoritesContainer}>
            <h2>Your Favorite Products</h2>
            {favorites.length === 0 ? (
                <p>No favorites found.</p>
            ) : (
                <div className="row">
                    {favorites.map((favorite, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 product-card">
                            <Link href={`/product-detail/${favorite.product.productId}`}>
                                <ShoeCardComponent
                                    name={favorite.product.name}
                                    image={favorite.product.mainImage}
                                    price={favorite.product.price}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
