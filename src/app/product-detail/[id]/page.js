"use client";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import styles from "./product-detail.module.css";
import FlashMessage from "@/components/flash-message/flashMessage";
import Image from "next/image";
import ShoeCardComponent from "@/components/shoeCard/shoeCard";
import Link from "next/link";

export default function ProductDetails({ params }) {
    const productID = params.id;
    const [product, setProduct] = useState(null);
    const [additionalProducts, setAdditionalProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [message, setMessage] = useState(null); // To store the response message
    const [messageType, setMessageType] = useState(''); // Can be 'success' or 'danger'
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);


    // Auto-hide the flash message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000); // Reset after 5 seconds
            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [message]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product-detail/${productID}`);
                if (!response.ok) {
                    setError("Product not found or failed to fetch");
                    return;
                }
                const productData = await response.json();
                setProduct(productData.product);
                setLoggedIn(productData.logged_in)

                // Set available colors and sizes if present
                setColors(productData.product.availableColors ? JSON.parse(productData.product.availableColors) : []);
                setSizes(productData.product.availableSizes ? JSON.parse(productData.product.availableSizes) : []);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Something went wrong");
            }
        };

        const fetchAdditionalProducts = async () => {
            try {
                const response = await fetch("/product-detail");
                if (!response.ok) {
                    setError("Failed to fetch additional products");
                    return;
                }
                const data = await response.json();

                // Filter out the current product from the additional products
                const filteredData = data.filter((item) => item.productId !== productID);
                setAdditionalProducts(filteredData);
            } catch (error) {
                console.error("Error fetching additional products:", error);
                setError("Something went wrong");
            }
        };

        // Fetch product details immediately
        fetchProduct();

        // Delay the execution of fetching additional products by 2 seconds
        const delayFetch = setTimeout(() => {
            fetchAdditionalProducts();
        }, 1000);

        // Cleanup the timeout
        return () => clearTimeout(delayFetch);
    }, [productID]);



    // Handle the form submission for adding to cart
    const handleAddToCart = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productId", productID);
        formData.append("selectedColor", selectedColor);
        formData.append("selectedSize", selectedSize);
        formData.append("quantity", parseInt(quantity)); // Ensure the quantity is a number

        try {
            const response = await fetch("/api/cart/add-to-cart", {
                method: "POST",
                body: formData,
            });

            const result = await response.json(); // Parse the JSON response

            if (response.ok) {
                setMessage(result.message); // Display success message
                setMessageType('success'); // Set flash message type to success
            } else {
                setMessage(result.message || "An error occurred."); // Display error message
                setMessageType('danger'); // Set flash message type to danger
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setMessage("An unexpected error occurred."); // Display unexpected error message
            setMessageType('danger');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <FlashMessage
                message={message}
                type={messageType}
                onClose={() => setMessage('')} // Clear the message after it's hidden
            />

            <div className="row mt-4">
                <div className="col-12 col-md-5 col-lg-5">
                    <Image
                        src={product.mainImage}
                        alt={product.name}
                        className="img-fluid"
                        width="500"
                        height="450"
                        priority={true}
                    />
                </div>
                <div className="col-12 col-md-7 col-lg-7">
                    <h3 className="mt-4">{product.name}</h3>
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>

                    <form onSubmit={handleAddToCart}>
                        <div className="form-group mb-3">
                            <label className="form-label">Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group mb-3">
                            {colors.length > 0 && (
                                <div>
                                    <label className="form-label">Select Color:</label>
                                    <div className={styles.colorSelector}>
                                        {colors.map((color, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ""}`}
                                                onClick={() => setSelectedColor(color)}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            {sizes.length > 0 && (
                                <div>
                                    <label className="form-label">Select Size:</label>
                                    <div className={styles.sizeSelector}>
                                        {sizes.map((size, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`${styles.sizeOption} ${selectedSize === size ? styles.selected : ""}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            {loggedIn ? (
                                <button type="submit" className="btn btn-outline-primary px-5 py-2 rounded-pill mt-3" style={{ width: "70%" }}>
                                    Add to Cart
                                </button>
                            ) : (
                                <button className="btn btn-outline-success px-5 py-2 rounded-pill mt-3" style={{ width: "70%" }}>
                                    <Link href={"/login"} style={{ textDecoration: "none" }}>
                                        Log in to add to Cart
                                    </Link>
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>

            <h1 className="text-center mt-5">
                Products you may also like
            </h1>
            <div className="row">
                {additionalProducts.map((product, index) => (
                    <div key={index} className="col-sm-12 col-md-3 col-lg-3 mb-4">
                        <Link href={`/product-detail/${product.productId}`} as={`/product-detail/${product.productId}`}>
                            <ShoeCardComponent
                                name={product.name}
                                price={product.price}
                                image={product.mainImage}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </Container>
    );
}
