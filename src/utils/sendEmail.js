import nodemailer from 'nodemailer';

export const sendInvoiceEmail = async (booking) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
  const unitPrice = booking.amount / nights;

  const guests =
    booking.type === 'Room'
      ? `Adults: ${booking.adults || 1}, Children: ${booking.children || 0}`
      : 'N/A';

  const slotOrRoom = booking.type === 'Room' ? booking.roomId : booking.slot;

  const mailOptions = {
    from: process.env.EMAIL,
    to: booking.email,
    subject: `Your ${booking.type} Booking Invoice`,
    html: `
      <h3>Booking Confirmed ✅</h3>
      <p>Thank you for booking with us!</p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.paymentId}</li>
        <li><strong>Booking Type:</strong> ${booking.type}</li>
        <li><strong>Room Type / Lawn Slot:</strong> ${slotOrRoom}</li>
        <li><strong>Guests:</strong> ${guests}</li>
        <li><strong>Check-in:</strong> ${booking.checkIn}</li>
        <li><strong>Check-out:</strong> ${booking.checkOut}</li>
        <li><strong>Number of Days:</strong> ${nights}</li>
        <li><strong>Unit Price:</strong> ₹${unitPrice.toFixed(2)}</li>
        <li><strong>Total Amount Paid:</strong> ₹${booking.amount}</li>
      </ul>
      <p>We’ll see you soon! Your invoice has also been sent to WhatsApp if provided.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
