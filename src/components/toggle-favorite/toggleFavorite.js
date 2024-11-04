"use client"

import styles from "./toggleFavorite.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function ToggleFavoriteComponent({ productId }) {

    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        // Fetch to check if the product is in favorites on component mount
        const fetchFavoriteStatus = async () => {
            try {
                const response = await fetch(`/api/favorites/check?productId=${productId}`);
                const data = await response.json();
                setIsFavorite(data.isFavorite);
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };
        fetchFavoriteStatus();
    }, [productId])

    // const toggleFavorite = async () => {
    //     try {
    //         const response = fetch(`/api/favorites/add-or-delete`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ productId })
    //         });

    //         const data = await response.json()

    //         if (response.ok) {
    //             setIsFavorite(data.isFavorite)
    //         }
    //     }
    //     catch (error) {
    //         console.error("Error toggling favorite.");
    //     }
    // }


    const toggleFavorite = async () => {
        // Optimistically toggle
        setIsFavorite(!isFavorite);

        try {
            const response = await fetch(`/api/favorites/add-or-delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId })
            });

            const data = await response.json();

            // If response fails, revert isFavorite to previous state
            if (!response.ok) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error("Error toggling favorite.");
            setIsFavorite(!isFavorite);  // Revert on error
        }
    };


    return (
        <button onClick={toggleFavorite} className={styles.toggleFavoriteButton}>
            <FontAwesomeIcon icon={isFavorite ? solidStar : regularStar} size="lg" className={styles.bookmarkIcon} />
        </button>
    )
}