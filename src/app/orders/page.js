"use client";

import { useState, useEffect } from 'react';
import { Card, Button, Collapse, Stack } from 'react-bootstrap';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Track which order is expanded
    const [errorMessage, setErrorMessage] = useState(""); // Track error message

    useEffect(() => {
        // Fetch user's orders on component mount
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/order/view-orders');
                if (!response.ok) {
                    throw new Error("Failed to fetch orders.");
                }
                const data = await response.json();
                setOrders(data.orders); // Assume API returns an array of orders
            } catch (error) {
                setErrorMessage("Error fetching orders.");
                console.error("Error:", error);
            }
        };

        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId) => {
        // Toggle the expanded view for an order
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">My Orders</h2>

            {/* Display error message */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {orders.map((order) => (
                <Card key={order.id} className="mb-3">
                    <Card.Body>
                        <Stack direction="horizontal" gap={3}>
                            <div>
                                <Card.Title>Order #{order.id}</Card.Title>
                                <Card.Text>Status: {order.status}</Card.Text>
                                <Card.Text>Total Amount: ${order.totalAmount.toFixed(2)}</Card.Text>
                                <Card.Text>Placed on: {new Date(order.createdAt).toLocaleDateString()}</Card.Text>
                            </div>
                            <Button
                                variant="primary"
                                className="ms-auto"
                                onClick={() => toggleOrderDetails(order.id)}
                            >
                                {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                            </Button>
                        </Stack>
                    </Card.Body>

                    {/* Collapsible section for order details */}
                    <Collapse in={expandedOrderId === order.id}>
                        <Card.Body>
                            <h5>Order Details</h5>
                            <ul>
                                {order.orderItems.map((item) => (
                                    <li key={item.id}>
                                        <p>
                                            <strong>{item.product.name}</strong> -
                                            {item.quantity} x ${item.priceAtTime.toFixed(2)} = ${(item.quantity * item.priceAtTime).toFixed(2)}
                                        </p>
                                        <p><strong>Color : </strong> {item.selectedColor}</p>
                                        <p><strong>Sze : </strong> {item.selectedSize}</p>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Collapse>
                </Card>
            ))}
        </div>
    );
}