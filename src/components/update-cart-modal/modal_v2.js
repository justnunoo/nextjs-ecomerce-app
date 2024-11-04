"use client";

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are loaded
import styles from "./update-cart-item.module.css";
import { updateCartItem } from "@/actions/actions";

export default function UpdateCartModal({ data, productId, cartItemId }) {
    const [productData, setProductData] = useState({});
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    // Find product and set state inside useEffect
    useEffect(() => {
        const product = data.find(product => product.productId === productId);
        if (product) {
            setProductData(product);
            setColors(product.availableColors ? JSON.parse(product.availableColors) : []);
            setSizes(product.availableSizes ? JSON.parse(product.availableSizes) : []);
        }
    }, [data, productId]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Call the updateCartItem action with necessary data
            const response = await updateCartItem({
                cartItemId,
                quantity: parseInt(quantity, 10),  // Ensure quantity is a number
                selectedColor,
                selectedSize
            });

            if (response.success) {
                // Close the modal or provide a success message
                toggleModal();
            } else {
                console.error(response.message);  // Display error to user
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };


    return (
        <>
            {/* Button to trigger the modal */}
            <button type="button" className="btn btn-outline-primary" onClick={toggleModal}>
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
                                    <form onSubmit={handleUpdate}>
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



// import { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from "./update-cart-item.module.css";
// import { updateCartItem } from "@/actions/actions";

// export default function UpdateCartModal({ data, productId, cartItemId, onUpdate }) {
//     const [productData, setProductData] = useState({});
//     const [colors, setColors] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [selectedColor, setSelectedColor] = useState('');
//     const [selectedSize, setSelectedSize] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         const product = data.find(product => product.productId === productId);
//         if (product) {
//             setProductData(product);
//             setColors(product.availableColors ? JSON.parse(product.availableColors) : []);
//             setSizes(product.availableSizes ? JSON.parse(product.availableSizes) : []);
//         }
//     }, [data, productId]);

//     const toggleModal = () => {
//         setIsVisible(!isVisible);
//     };

//     const handleEscape = (e) => {
//         if (e.key === 'Escape' && isVisible) {
//             toggleModal();
//         }
//     };

//     useEffect(() => {
//         window.addEventListener('keydown', handleEscape);
//         return () => {
//             window.removeEventListener('keydown', handleEscape);
//         };
//     }, [isVisible]);

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await updateCartItem({
//                 cartItemId,
//                 quantity: parseInt(quantity, 10),
//                 selectedColor,
//                 selectedSize
//             });

//             if (response.success) {
//                 // Update the cart item in the Cart component
//                 onUpdate(response.updatedItem);
//                 toggleModal();
//             } else {
//                 console.error(response.message);
//             }
//         } catch (error) {
//             console.error("Error updating cart item:", error);
//         }
//     };

//     return (
//         <>
//             <button type="button" className="btn btn-outline-primary" onClick={toggleModal}>
//                 Update
//             </button>

//             {isVisible && (
//                 <>
//                     <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" role="dialog" id='updateCartModal'>
//                         <div className="modal-dialog" role="document">
//                             <div className="modal-content">
//                                 <div className="modal-header">
//                                     <h5 className="modal-title">Update Item</h5>
//                                     <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
//                                 </div>
//                                 <div className="modal-body">
//                                     <form>
//                                         <div className="form-group">
//                                             <label htmlFor="color">Select Color:</label>
//                                             <select
//                                                 id="color"
//                                                 className="form-control"
//                                                 value={selectedColor}
//                                                 onChange={(e) => setSelectedColor(e.target.value)}
//                                             >
//                                                 <option value="">Select</option>
//                                                 {colors.map((color, index) => (
//                                                     <option key={index} value={color}>
//                                                         {color}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         <div className="form-group">
//                                             <label htmlFor="size">Select Size:</label>
//                                             <select
//                                                 id="size"
//                                                 className="form-control"
//                                                 value={selectedSize}
//                                                 onChange={(e) => setSelectedSize(e.target.value)}
//                                             >
//                                                 <option value="">Select</option>
//                                                 {sizes.map((size, index) => (
//                                                     <option key={index} value={size}>
//                                                         {size}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         <div className="form-group">
//                                             <label htmlFor="quantity">Quantity:</label>
//                                             <input
//                                                 id="quantity"
//                                                 type="number"
//                                                 min="1"
//                                                 className="form-control"
//                                                 value={quantity}
//                                                 onChange={(e) => setQuantity(e.target.value)}
//                                             />
//                                         </div>

//                                         <button type="submit" className="btn btn-primary mt-3" onClick={handleUpdate}>
//                                             Update Item
//                                         </button>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="modal-backdrop fade show"></div>
//                 </>
//             )}
//         </>
//     );
// }
