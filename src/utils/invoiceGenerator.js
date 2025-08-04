import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
  const doc = new jsPDF();

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

  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text('Ø‹ßè Gouri Inn', 14, 20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Gouri Inn, Amravati, Maharashtra', 14, 28);
  doc.text('Phone: +91-XXXXXXXXXX | Email: contact@gouriinn.com', 14, 34);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Booking Invoice', 14, 48);

  // Invoice table
  autoTable(doc, {
    startY: 55,
    head: [['Field', 'Details']],
    body: [
      ['Booking Type', bookingType || 'N/A'],
      ['Room Option', formData.slot || formData.roomId || 'N/A'],
      ['Email', formData.email || '-'],
      ['Phone', formData.phone || '-'],
      ['Check-in', formData.checkIn || '-'],
      ['Check-out', formData.checkOut || '-'],
      ['Guests', `${formData.adults || 0} Adult(s), ${formData.children || 0} Child(ren)`],
      ['Amount Paid', `₹${price}`],
      ['Payment ID', paymentId || '-'],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [33, 37, 41], // dark navy
      textColor: [255, 255, 255],
      fontSize: 12,
    },
    bodyStyles: {
      fillColor: [245, 248, 250], // light greyish rows
      textColor: [60, 60, 60],
      fontSize: 11,
    },
    styles: {
      font: 'helvetica',
      fontStyle: 'normal',
      halign: 'left',
      valign: 'middle',
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  // Footer note
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.setFont('helvetica', 'italic');
  doc.text(
    '* Thank you for booking with Gouri Inn. We look forward to your stay!',
    14,
    doc.lastAutoTable.finalY + 12
  );

  return doc.output('blob');
};


// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
//   const doc = new jsPDF();

//   doc.setFontSize(22);
//   doc.setTextColor(40, 60, 100);
//   doc.text('🏨 Booking Confirmation Invoice', 14, 20);

//   doc.setFontSize(12);
//   doc.setTextColor(100);
//   doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 28);

//   const stayDays =
//     formData.checkIn && formData.checkOut
//       ? Math.max(
//           1,
//           Math.ceil(
//             (new Date(formData.checkOut) - new Date(formData.checkIn)) /
//               (1000 * 60 * 60 * 24)
//           )
//         )
//       : 1;

//   autoTable(doc, {
//     startY: 36,
//     head: [['Field', 'Details']],
//     theme: 'striped',
//     headStyles: { fillColor: [0, 102, 204] },
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
//       ['Rate per Day', `₹${(price / stayDays).toFixed(2)}`],
//       ['Amount Paid', `₹${price}`],
//       ['Payment ID', paymentId],
//     ],
//     styles: {
//       fontSize: 11,
//       textColor: 50,
//       cellPadding: 3,
//     },
//   });

//   doc.setTextColor(80);
//   doc.setFontSize(12);
//   doc.text(
//     '✅ Thank you for your booking. Have a pleasant stay!',
//     14,
//     doc.lastAutoTable.finalY + 12
//   );
  
//   return doc.output('blob'); // 
// };
