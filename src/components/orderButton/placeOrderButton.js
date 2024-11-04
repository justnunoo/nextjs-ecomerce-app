import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaceOrder() {
    const [loading, setLoading] = useState(false);
    const [orderErrorMessage, setOrderErrorMessage] = useState(null);
    const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);
    const router = useRouter()

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
                setOrderSuccessMessage(data.message); // Handle success response
                router.push("/")
            } else {
                const errorData = await response.json();
                setOrderErrorMessage(errorData.message); // Handle error response
            }
        } catch (error) {
            setOrderErrorMessage("Something went wrong. Please try again.");
            console.error("Error placing order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handlePlaceOrder} className="btn btn-outline-success ms-auto" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <div style={{ marginTop: '20px' }}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}


            </div>
        </div>
    );
}
