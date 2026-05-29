import jsPDF from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';

export async function generateReceipt(table, rows, total) {
  const doc = new jsPDF({ unit: 'mm', format: [80, 200], orientation: 'portrait' });
  const W = 80;
  let y = 8;

  const line = (text, x, fontSize = 9, align = 'left', bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    if (align === 'center') doc.text(text, W / 2, y, { align: 'center' });
    else if (align === 'right') doc.text(text, W - x, y, { align: 'right' });
    else doc.text(text, x, y);
  };

  const rule = () => {
    doc.setDrawColor(180);
    doc.line(4, y, W - 4, y);
    y += 4;
  };

  const skip = (n = 4) => { y += n; };

  // Header
  line('Brew & Co.', 4, 16, 'center', true); skip(6);
  line('Where Every Sip Tells a Story', 4, 7, 'center'); skip(5);
  rule();

  // Table + date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  line(`Table: ${table.name || 'Table ' + table.id}`, 4, 8); skip(5);
  line(`Date: ${dateStr}  Time: ${timeStr}`, 4, 8); skip(5);
  rule();

  // Items header
  line('Item', 4, 8, 'left', true);
  line('Qty', 34, 8, 'left', true);
  line('Price', 46, 8, 'left', true);
  line('Total', 4, 8, 'right', true);
  skip(5);
  rule();

  // Items
  rows.forEach(r => {
    line(r.name.length > 18 ? r.name.slice(0, 17) + '…' : r.name, 4, 8);
    line(String(r.qty), 34, 8);
    line(`₹${r.price}`, 46, 8);
    line(`₹${r.qty * r.price}`, 4, 8, 'right');
    skip(5);
  });

  rule();

  // Total
  line('TOTAL', 4, 11, 'left', true);
  line(`Rs.${total.toLocaleString('en-IN')}`, 4, 11, 'right', true);
  skip(6);
  rule();

  // Footer
  line('Thank you for visiting!', 4, 8, 'center');
  skip(4);
  line('customer-sable-seven.vercel.app', 4, 7, 'center');
  skip(6);

  // Save to device
  const fileName = `Receipt-Table${table.id}-${Date.now()}.pdf`;
  const pdfBase64 = doc.output('datauristring').split(',')[1];

  try {
    await Filesystem.writeFile({
      path: fileName,
      data: pdfBase64,
      directory: Directory.Documents,
    });
    return { success: true, fileName };
  } catch {
    // Fallback: browser download
    doc.save(fileName);
    return { success: true, fileName };
  }
}
