"use client";

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are loaded
import styles from "./update-cart-item.module.css";
import { updateCartItem } from "@/actions/actions";

export default function UpdateCartModal({ data, productId, cartItemId }) {
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState({});
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    // Escape function to close modal on pressing 'Escape'
    const handleEscape = (e) => {
        if (e.key === 'Escape' && isVisible) {
            toggleModal();
        }
    };

    useEffect(() => {
        // Attach keydown event listener when the modal is open
        window.addEventListener('keydown', handleEscape);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isVisible]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/products`);
                if (!response) {
                    console.error('Failed to fetch data');
                    return;
                }
                const data = await response.json();

                // Debug: Log the fetched data
                console.log('Fetched data:', data);

                // Assuming you receive available colors and sizes with each product
                setColors(data.availableColors ? JSON.parse(data.availableColors) : []);
                setSizes(data.availableSizes ? JSON.parse(data.availableSizes) : []);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter product data by productId
        const product = products.find(item => item.productId === productId);
        if (product) {
            setProductData(product);

            // Debug: Log the product data to verify colors and sizes
            console.log('Product data:', product);

            // Set colors and sizes for the product if available
            setColors(product.availableColors ? JSON.parse(product.availableColors) : []);
            setSizes(product.availableSizes ? JSON.parse(product.availableSizes) : []);
        }
    }, [products, productId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Update cart item logic (API call or local update)
        console.log({
            cartItemId,
            quantity,
            selectedColor,
            selectedSize,
        });
        // Close modal after submission
        toggleModal();
    };

    return (
        <>
            {/* Button to trigger the modal */}
            <button type="button" className="btn btn-primary" onClick={toggleModal}>
                Update
            </button>

            {/* Modal */}
            {isVisible && (
                <>
                    <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" role="dialog" id='updateCartModal'>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update cart</h5>
                                    <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form action={updateCartItem}>
                                        <input type='hidden' name='cartItemId' value={cartItemId} />
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

                                        {/* Render colors only if available */}
                                        <div className="form-group mb-3">
                                            {colors.length > 0 ? (
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
                                                    <input type="hidden" name='selectedColor' value={selectedColor}></input>
                                                </div>
                                            ) : (
                                                <p>Loading available colors ...</p> // Fallback message
                                            )}
                                        </div>

                                        {/* Render sizes only if available */}
                                        <div className="form-group mb-3">
                                            {sizes.length > 0 ? (
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
                                                    <input type='hidden' name='selectedSize' value={selectedSize}></input>
                                                </div>
                                            ) : (
                                                <p>Loading available sizes ...</p> // Fallback message
                                            )}
                                        </div>

                                        <div style={{ textAlign: "center" }}>
                                            <button
                                                type="submit"
                                                className="btn btn-outline-primary px-5 py-2 rounded-pill mt-3"
                                                style={{ width: "80%" }}
                                            >
                                                Update Cart
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal backdrop */}
                    <div className="modal-backdrop fade show" onClick={toggleModal}></div>
                </>
            )}
        </>
    );
}
