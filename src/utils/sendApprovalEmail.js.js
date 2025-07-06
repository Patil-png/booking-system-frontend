import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (booking) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const bookingLink = `${import.meta.env.VITE_API_BASE_URL}/room-booking?bookingId=${booking._id}`;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: booking.email,
    subject: 'Booking Approved - Complete Your Payment',
    html: `
      <h2>Hello,</h2>
      <p>Your booking request for <strong>${booking.type}</strong> from <strong>${booking.checkIn}</strong> to <strong>${booking.checkOut}</strong> has been <span style="color:green;">approved</span> by our admin.</p>
      <p>Please complete your booking by clicking the link below and proceeding with payment:</p>
      <a href="${bookingLink}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;border-radius:5px;text-decoration:none;">Proceed to Payment</a>
      <p>If you have any questions, feel free to contact us.</p>
      <br />
      <p>Thank you!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
