import React, { useState } from 'react';
import Razorpay from 'react-razorpay';

const RazorpayPayment = ({ billAmount, onSuccess }) => {
    const [paymentId, setPaymentId] = useState(null);

    const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay API key
        amount: billAmount * 100, // Amount in paise
        name: 'Bill Payment',
        description: 'Payment for Bill',
        handler: function (response) {
            setPaymentId(response.razorpay_payment_id);
            onSuccess(response.razorpay_payment_id);
        },
        prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
        },
        notes: {
            address: 'Billing Address',
        },
        theme: {
            color: '#F37254',
        },
    };

    return (
        <div>
            <Razorpay {...options}>
                <button>Pay Now</button>
            </Razorpay>
            {paymentId && <p>Payment successful! Payment ID: {paymentId}</p>}
        </div>
    );
};

export default RazorpayPayment;
