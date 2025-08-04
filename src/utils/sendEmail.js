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
    from: `"Gouri Inn Amravati" <${process.env.EMAIL}>`,
    to: booking.email,
    subject: `Official Invoice - ${booking.type} Booking | Gouri Inn`,
    html: `
      <div style="max-width: 650px; margin: 30px auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; color: #333; border: 1px solid #ccc; border-radius: 6px;">
        <div style="border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #2c3e50;">Gouri Inn Amravati</h1>
          <p style="margin: 5px 0; font-size: 14px;">Official Booking Invoice</p>
        </div>

        <div style="margin-bottom: 30px;">
          <p>Dear Guest,</p>
          <p>
            We are pleased to confirm your booking. Below are the official details of your reservation.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tbody>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Invoice Number:</strong></td>
              <td style="padding: 10px;">${booking.paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Booking Type:</strong></td>
              <td style="padding: 10px;">${booking.type}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Room / Lawn Slot:</strong></td>
              <td style="padding: 10px;">${slotOrRoom}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Check-in Date:</strong></td>
              <td style="padding: 10px;">${booking.checkIn}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Check-out Date:</strong></td>
              <td style="padding: 10px;">${booking.checkOut}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Total Nights:</strong></td>
              <td style="padding: 10px;">${nights}</td>
            </tr>
            ${
              booking.type === 'Room'
                ? `<tr>
                    <td style="padding: 10px; background: #f5f5f5;"><strong>Guests:</strong></td>
                    <td style="padding: 10px;">${guests}</td>
                   </tr>`
                : ''
            }
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Price per Night:</strong></td>
              <td style="padding: 10px;">₹${unitPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f5f5f5;"><strong>Total Amount Paid:</strong></td>
              <td style="padding: 10px;"><strong>₹${booking.amount}</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-bottom: 20px;">
          <p>If you have provided a WhatsApp number, a copy of this invoice has also been sent there for your convenience.</p>
          <p>We appreciate your trust and look forward to hosting you at <strong>Gouri Inn</strong>.</p>
        </div>

        <div style="border-top: 1px solid #ccc; padding-top: 20px; font-size: 13px; color: #777;">
          <p>
            <strong>Gouri Inn Amravati</strong><br/>
            Near XYZ Road, Amravati, Maharashtra<br/>
            📞 +91-XXXXXXXXXX | 🌐 www.gouriinn.com
          </p>
          <p style="margin-top: 10px;">
            This is an auto-generated email. Please do not reply directly.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


// import nodemailer from 'nodemailer';

// export const sendInvoiceEmail = async (booking) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const checkInDate = new Date(booking.checkIn);
//   const checkOutDate = new Date(booking.checkOut);
//   const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
//   const unitPrice = booking.amount / nights;

//   const guests =
//     booking.type === 'Room'
//       ? `Adults: ${booking.adults || 1}, Children: ${booking.children || 0}`
//       : 'N/A';

//   const slotOrRoom = booking.type === 'Room' ? booking.roomId : booking.slot;

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: booking.email,
//     subject: `Your ${booking.type} Booking Invoice`,
//     html: `
//       <h3>Booking Confirmed ✅</h3>
//       <p>Thank you for booking with us!</p>
//       <ul>
//         <li><strong>Booking ID:</strong> ${booking.paymentId}</li>
//         <li><strong>Booking Type:</strong> ${booking.type}</li>
//         <li><strong>Room Type / Lawn Slot:</strong> ${slotOrRoom}</li>
//         <li><strong>Guests:</strong> ${guests}</li>
//         <li><strong>Check-in:</strong> ${booking.checkIn}</li>
//         <li><strong>Check-out:</strong> ${booking.checkOut}</li>
//         <li><strong>Number of Days:</strong> ${nights}</li>
//         <li><strong>Unit Price:</strong> ₹${unitPrice.toFixed(2)}</li>
//         <li><strong>Total Amount Paid:</strong> ₹${booking.amount}</li>
//       </ul>
//       <p>We’ll see you soon! Your invoice has also been sent to WhatsApp if provided.</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

