import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = ({ bookingType, formData, price, paymentId }) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(40, 60, 100);
  doc.text('🏨 Booking Confirmation Invoice', 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 28);

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

  doc.setTextColor(80);
  doc.setFontSize(12);
  doc.text(
    '✅ Thank you for your booking. Have a pleasant stay!',
    14,
    doc.lastAutoTable.finalY + 12
  );
  
  return doc.output('blob'); // 
};
