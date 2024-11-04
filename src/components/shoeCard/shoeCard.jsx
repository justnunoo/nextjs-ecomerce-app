"use client"

import styles from "./shoeCard.module.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function ShoeCardComponent({ image, name, price, color, addToCart }) {

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart();
    } else {
      console.log(`${name} added to the cart`);
    }
  };

  return (
    <div className={styles.shoeCard}>
      {/* Use the Next.js Image component for better optimization */}
      <Image
        src={image}
        alt={name || "Shoe"}
        width={300}
        height={300}
        className={`${styles.shoeImage} img-fluid`} // Combine class names
        priority={true}
      // placeholder="blur"
      />

      <div className={styles.details}>
        <h5>{name}</h5>
        {color && <p>{color}</p>}
        <p>Price: ${price}</p>
        {addToCart && (
          <button onClick={handleAddToCart} className="btn btn-outline-primary mt-2">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}