import nodemailer from 'nodemailer';

// Create a transporter object with the email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
});

// Function to send order confirmation email
export async function sendOrderConfirmationEmail(userEmail, orderItems) {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new Error('Invalid order details provided');
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: userEmail, // Receiver's email address
        subject: 'Order Confirmation', // Subject line
        html: `
            <h3>Thank you for your order!</h3>
            <p>Your order has been placed successfully. Here are the details:</p>
            <ul>
                ${orderItems.map(item => `
                    <li>${item.quantity} x ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) - $${item.priceAtTime.toFixed(2)}</li>
                `).join('')}
            </ul>
            <p><strong>Total: $${orderItems.reduce((total, item) => total + (item.priceAtTime * item.quantity), 0).toFixed(2)}</strong></p>
            <p>We will notify you once your order is shipped.</p>
        `,
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
