"use client";

import { useState, useEffect } from 'react';
import { deleteFromCart } from "@/actions/actions"; // Ensure this action handles async deletion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UpdateCartModal from "@/components/update-cart-modal/modal_v2";
import { Stack, Button } from 'react-bootstrap';
import PlaceOrder from '@/components/orderButton/placeOrderButton';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderErrorMessage, setOrderErrorMessage] = useState(null);
    const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);
    const [cartEmpty, setCartEmpty] = useState(true);

    const router = useRouter(); // Initialize router

    // Fetch cart items and products on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cartResponse, productResponse] = await Promise.all([
                    fetch("/api/cart/cart-items"),
                    fetch("/api/products")
                ]);

                if (!cartResponse.ok || !productResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const cartData = await cartResponse.json();
                const productsData = await productResponse.json();

                if (cartData.success) {
                    setCart(cartData.cartItems);
                    setMessage(cartData.message);
                } else {
                    setErrorMessage(cartData.message);
                }

                setProducts(productsData);
            } catch (error) {
                setErrorMessage("Error fetching data.");
            }
        };

        fetchData();
    }, []);

    // Check if the cart is empty
    useEffect(() => {
        setCartEmpty(cart.length > 0);
    }, [cart.length]);

    // Clear success or error messages after 4 seconds
    useEffect(() => {
        if (message || errorMessage || orderErrorMessage || orderSuccessMessage) {
            const timer = setTimeout(() => {
                setMessage("");
                setErrorMessage("");
                setOrderErrorMessage("");
                setOrderSuccessMessage("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, errorMessage, orderErrorMessage, orderSuccessMessage]);

    // Handle item deletion asynchronously
    const handleDelete = async (itemId) => {
        try {
            await deleteFromCart({ itemId });
            setCart(prevCart => prevCart.filter(item => item.id !== itemId));
            setMessage("Item successfully deleted.");
        } catch (error) {
            setErrorMessage("Error deleting item.");
        }
    };

    // Handle order placement
    const handlePlaceOrder = async () => {
        setLoading(true);
        setOrderErrorMessage(null);
        setOrderSuccessMessage(null);

        try {
            const response = await fetch('/api/order/place-order', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setOrderSuccessMessage(data.message);
                setCart([]);
                router.push("/"); // Navigate after successful order
            } else {
                const errorData = await response.json();
                setOrderErrorMessage(errorData.message || "Failed to place order.");
            }
        } catch (error) {
            setOrderErrorMessage("Something went wrong. Please try again.");
            console.error("Error placing order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container mb-5'>
            {message && <div className="alert alert-success">{message}</div>}
            {orderSuccessMessage && <div className="alert alert-success">{orderSuccessMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {orderErrorMessage && <div className="alert alert-danger">{orderErrorMessage}</div>}

            <h2 className='text-center my-3'>Cart Items</h2>

            <div className='table-responsive'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Sub Total</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cart.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.color}</td>
                                    <td>{item.size}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.quantity * item.price}</td>
                                    <td>
                                        <UpdateCartModal data={products} productId={item.productID} cartItemId={item.id} />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Stack direction='horizontal' gap={3}>
                    <h4>Total: ${cart.reduce((acc, item) => acc + item.quantity * item.price, 0)}</h4>
                    {
                        cartEmpty && <button onClick={handlePlaceOrder} className="btn btn-outline-success ms-auto" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    }
                </Stack>
            </div>
        </div>
    );
}



// "use client";

// import { useState, useEffect } from 'react';
// import { deleteFromCart } from "@/actions/actions";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// import UpdateCartModal from "@/components/update-cart-modal/modal_v2";
// import { Stack, Button } from 'react-bootstrap';
// import PlaceOrder from '@/components/orderButton/placeOrderButton';
// import { useRouter } from 'next/navigation';

// export default function Cart() {
//     const [cart, setCart] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [message, setMessage] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [orderErrorMessage, setOrderErrorMessage] = useState(null);
//     const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);
//     const [cartEmpty, setCartEmpty] = useState(true);

//     const router = useRouter();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [cartResponse, productResponse] = await Promise.all([
//                     fetch("/api/cart/cart-items"),
//                     fetch("/api/products")
//                 ]);

//                 if (!cartResponse.ok || !productResponse.ok) {
//                     throw new Error("Failed to fetch data");
//                 }

//                 const cartData = await cartResponse.json();
//                 const productsData = await productResponse.json();

//                 if (cartData.success) {
//                     setCart(cartData.cartItems);
//                     setMessage(cartData.message);
//                 } else {
//                     setErrorMessage(cartData.message);
//                 }

//                 setProducts(productsData);
//             } catch (error) {
//                 setErrorMessage("Error fetching data.");
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         setCartEmpty(cart.length > 0);
//     }, [cart.length]);

//     useEffect(() => {
//         if (message || errorMessage || orderErrorMessage || orderSuccessMessage) {
//             const timer = setTimeout(() => {
//                 setMessage("");
//                 setErrorMessage("");
//                 setOrderErrorMessage("");
//                 setOrderSuccessMessage("");
//             }, 4000);
//             return () => clearTimeout(timer);
//         }
//     }, [message, errorMessage, orderErrorMessage, orderSuccessMessage]);

//     const handleDelete = async (itemId) => {
//         try {
//             await deleteFromCart({ itemId });
//             setCart(prevCart => prevCart.filter(item => item.id !== itemId));
//             setMessage("Item successfully deleted.");
//         } catch (error) {
//             setErrorMessage("Error deleting item.");
//         }
//     };

//     // Function to update an item in the cart
//     const updateCartItemInCart = (updatedItem) => {
//         setCart(prevCart => prevCart.map(item =>
//             item.id === updatedItem.id ? updatedItem : item
//         ));
//     };

//     const handlePlaceOrder = async () => {
//         setLoading(true);
//         setOrderErrorMessage(null);
//         setOrderSuccessMessage(null);

//         try {
//             const response = await fetch('/api/order/place-order', {
//                 method: 'GET',
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setOrderSuccessMessage(data.message);
//                 setCart([]);
//                 router.push("/");
//             } else {
//                 const errorData = await response.json();
//                 setOrderErrorMessage(errorData.message || "Failed to place order.");
//             }
//         } catch (error) {
//             setOrderErrorMessage("Something went wrong. Please try again.");
//             console.error("Error placing order:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className='container mb-5'>
//             {message && <div className="alert alert-success">{message}</div>}
//             {orderSuccessMessage && <div className="alert alert-success">{orderSuccessMessage}</div>}
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//             {orderErrorMessage && <div className="alert alert-danger">{orderErrorMessage}</div>}

//             <h2 className='text-center my-3'>Cart Items</h2>

//             <div className='table-responsive'>
//                 <table className='table table-striped'>
//                     <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>Color</th>
//                             <th>Size</th>
//                             <th>Quantity</th>
//                             <th>Sub Total</th>
//                             <th></th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {
//                             cart.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.name}</td>
//                                     <td>{item.color}</td>
//                                     <td>{item.size}</td>
//                                     <td>{item.quantity}</td>
//                                     <td>${item.quantity * item.price}</td>
//                                     <td>
//                                         <UpdateCartModal
//                                             data={products}
//                                             productId={item.productID}
//                                             cartItemId={item.id}
//                                             onUpdate={updateCartItemInCart} // Pass the callback
//                                         />
//                                     </td>
//                                     <td>
//                                         <button
//                                             type="button"
//                                             className="btn btn-outline-danger"
//                                             onClick={() => handleDelete(item.id)}
//                                         >
//                                             <FontAwesomeIcon icon={faTrashAlt} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         }
//                     </tbody>
//                 </table>
//                 <Stack direction='horizontal' gap={3}>
//                     <h4>Total: ${cart.reduce((acc, item) => acc + item.quantity * item.price, 0)}</h4>
//                     {
//                         cartEmpty && <button onClick={handlePlaceOrder} className="btn btn-outline-success ms-auto" disabled={loading}>
//                             {loading ? 'Placing Order...' : 'Place Order'}
//                         </button>
//                     }
//                 </Stack>
//             </div>
//         </div>
//     );
// }
