export const openRazorpay = ({ amount, name, email, phone, onSuccess }) => {
  const options = {
    key: 'rzp_test_YourKeyHere', // Replace with your Razorpay key
    amount: amount * 100, // in paise
    currency: 'INR',
    name: 'Hotel & Lawn Booking',
    description: 'Booking Payment',
    handler: function (response) {
      alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      onSuccess(response);
    },
    prefill: {
      name,
      email,
      contact: phone,
    },
    notes: {
      booking: 'Room/Lawn',
    },
    theme: {
      color: '#3399cc'
    }
  };
  
};
