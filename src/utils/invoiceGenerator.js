import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
  const doc = new jsPDF();

  // Styling header
  doc.setFontSize(22);
  doc.setTextColor(40, 60, 100);
  doc.text('🏨 Booking Confirmation Invoice', 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 28);

  // Calculate total stay days
  const stayDays =
    formData.checkIn && formData.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(formData.checkOut) - new Date(formData.checkIn)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  // Setup table
  autoTable(doc, {
    startY: 36,
    head: [['Field', 'Details']],
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    body: [
      ['Booking Type', bookingType],
      ['Name', formData.email],
      ['Phone', formData.phone],
      ['Check-in', formData.checkIn],
      ['Check-out', formData.checkOut],
      ['Slot/Room', formData.slot || formData.roomId || 'N/A'],
      ['Adults', formData.adults || '-'],
      ['Children', formData.children || '-'],
      ['Total Days', stayDays],
      ['Rate per Day', `₹${(price / stayDays).toFixed(2)}`],
      ['Amount Paid', `₹${price}`],
      ['Payment ID', paymentId],
    ],
    styles: {
      fontSize: 11,
      textColor: 50,
      cellPadding: 3,
    },
  });

  // Footer note
  doc.setTextColor(80);
  doc.setFontSize(12);
  doc.text(
    '✅ Thank you for your booking. Have a pleasant stay!',
    14,
    doc.lastAutoTable.finalY + 12
  );

  doc.save(`invoice_${bookingType}_${Date.now()}.pdf`);
};


// // ✅ Update generateInvoice.js to include price breakdown and room info
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text('Booking Confirmation Invoice', 14, 22);

//   const stayDays = formData.checkIn && formData.checkOut
//     ? Math.max(1, Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)))
//     : 1;

//   autoTable(doc, {
//     startY: 30,
//     head: [['Field', 'Details']],
//     body: [
//       ['Booking Type', bookingType],
//       ['Name', formData.email],
//       ['Phone', formData.phone],
//       ['Check-in', formData.checkIn],
//       ['Check-out', formData.checkOut],
//       ['Slot/Room', formData.slot || formData.roomId || 'N/A'],
//       ['Adults', formData.adults || '-'],
//       ['Children', formData.children || '-'],
//       ['Total Days', stayDays],
//       ['Rate per Day', `₹${price / stayDays}`],
//       ['Amount Paid', `₹${price}`],
//       ['Payment ID', paymentId],
//     ],
//   });

//   doc.save(`invoice_${bookingType}_${Date.now()}.pdf`);
// };


// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text('Booking Confirmation Invoice', 14, 22);

//   autoTable(doc, {
//     startY: 30,
//     head: [['Field', 'Details']],
//     body: [
//       ['Booking Type', bookingType],
//       ['Name', formData.email],
//       ['Phone', formData.phone],
//       ['Check-in', formData.checkIn],
//       ['Check-out', formData.checkOut],
//       ['Slot/Room', formData.slot || formData.roomId],
//       ['Amount Paid', `₹${price}`],
//       ['Payment ID', paymentId],
//     ],
//   });

//   doc.save(`invoice_${bookingType}_${Date.now()}.pdf`);
// };
