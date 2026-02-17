import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  image?: string;
  product_image?: string;
  qty?: number;
  quantity?: number;
  price: number;
  total: number;
  variant?: string;
}

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  shipping_cost: number;
  final_amount: number;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
}

export function generateInvoice(order: Order) {
  const doc = new jsPDF();
  
  // Company/Business Info
  const companyName = 'PhoneMart';
  const companyTagline = 'Your Trusted Mobile Partner';
  const companyAddress = 'Bangladesh';
  const companyPhone = 'Contact: +880-XXX-XXXX';
  
  // Header Section with Background Color
  doc.setFillColor(233, 103, 43); // Orange color matching brand
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company Name - Large and Bold
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.text(companyName, 105, 20, { align: 'center' });
  
  // Company Tagline
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(companyTagline, 105, 28, { align: 'center' });
  
  // Invoice Title Box
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 40, 210, 15, 'F');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', 105, 50, { align: 'center' });
  
  // Company Info Section (Left Side)
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text(companyName, 20, 65);
  doc.text(companyAddress, 20, 72);
  doc.text(companyPhone, 20, 79);
  
  // Invoice Details Box (Right Side)
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(130, 60, 70, 25, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold');
  doc.text('Invoice Details', 165, 67, { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.text(`Invoice #:`, 135, 73);
  doc.setFont(undefined, 'bold');
  doc.text(order.order_code, 175, 73, { align: 'right' });
  doc.setFont(undefined, 'normal');
  doc.text(`Date:`, 135, 78);
  doc.text(new Date(order.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }), 175, 78, { align: 'right' });
  
  // Status Badges
  const statusY = 85;
  const deliveryStatusColor = order.delivery_status === 'delivered' ? [34, 197, 94] : 
                              order.delivery_status === 'processing' ? [59, 130, 246] : 
                              order.delivery_status === 'cancelled' ? [239, 68, 68] : [234, 179, 8];
  doc.setFillColor(deliveryStatusColor[0], deliveryStatusColor[1], deliveryStatusColor[2]);
  doc.roundedRect(135, statusY, 32, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text(order.delivery_status.toUpperCase(), 151, statusY + 5.5, { align: 'center' });
  
  const paymentStatusColor = order.payment_status === 'paid' ? [34, 197, 94] : 
                             order.payment_status === 'pending' ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(paymentStatusColor[0], paymentStatusColor[1], paymentStatusColor[2]);
  doc.roundedRect(173, statusY, 27, 8, 2, 2, 'F');
  doc.text(order.payment_status.toUpperCase(), 186.5, statusY + 5.5, { align: 'center' });
  
  // Customer Info Section
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, 100, 85, 30, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 25, 108);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(order.customer.name, 25, 115);
  doc.text(order.customer.mobile, 25, 122);
  if (order.customer.email) {
    doc.text(order.customer.email, 25, 129);
  }
  doc.setFontSize(8);
  const addressLines = doc.splitTextToSize(order.customer.address || 'N/A', 75);
  doc.text(addressLines, 25, 136);
  
  // Order Items Table
  const tableData = order.items.map((item) => {
    const productName = item.name || item.product_name || 'Product';
    const quantity = item.qty || item.quantity || 1;
    const unitPrice = item.price || 0;
    const total = item.total || (unitPrice * quantity);
    
    return [
      productName + (item.variant ? ` (${item.variant})` : ''),
      quantity.toString(),
      `৳${unitPrice.toLocaleString()}`,
      `৳${total.toLocaleString()}`
    ];
  });
  
  const startTableY = 140;
  
  autoTable(doc, {
    startY: startTableY,
    head: [['Product', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [233, 103, 43], 
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 90, cellPadding: { left: 5, right: 2, top: 3, bottom: 3 } },
      1: { cellWidth: 25, halign: 'center', cellPadding: { left: 2, right: 2, top: 3, bottom: 3 } },
      2: { cellWidth: 35, halign: 'right', cellPadding: { left: 2, right: 5, top: 3, bottom: 3 } },
      3: { cellWidth: 40, halign: 'right', cellPadding: { left: 2, right: 5, top: 3, bottom: 3 }, fontStyle: 'bold' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  
  // Summary Section with Box
  const summaryStartY = finalY + 20;
  const summaryBoxHeight = order.discount_amount > 0 ? 45 : 38;
  
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(130, summaryStartY, 70, summaryBoxHeight, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  let summaryY = summaryStartY + 8;
  
  // Subtotal
  doc.setFont(undefined, 'normal');
  doc.text('Subtotal:', 135, summaryY);
  doc.text(`৳${order.total_amount.toLocaleString()}`, 195, summaryY, { align: 'right' });
  summaryY += 7;
  
  // Discount
  if (order.discount_amount > 0) {
    doc.setTextColor(34, 197, 94);
    doc.text('Discount:', 135, summaryY);
    doc.text(`-৳${order.discount_amount.toLocaleString()}`, 195, summaryY, { align: 'right' });
    doc.setTextColor(40, 40, 40);
    summaryY += 7;
  }
  
  // Shipping
  doc.text('Shipping:', 135, summaryY);
  doc.text(`৳${order.shipping_cost.toLocaleString()}`, 195, summaryY, { align: 'right' });
  summaryY += 7;
  
  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(135, summaryY, 195, summaryY);
  summaryY += 5;
  
  // Total
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(233, 103, 43);
  doc.text('Total Amount:', 135, summaryY);
  doc.text(`৳${order.final_amount.toLocaleString()}`, 195, summaryY, { align: 'right' });
  
  // Payment Method Section
  summaryY = summaryStartY + summaryBoxHeight + 15;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, summaryY, 85, 12, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont(undefined, 'normal');
  doc.text('Payment Method:', 25, summaryY + 5);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text(order.payment_method.toUpperCase(), 25, summaryY + 10);
  
  // Footer Section
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageHeight - 25, 210, 25, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(233, 103, 43);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for your business!', 105, pageHeight - 15, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, 'normal');
  doc.text('This is a computer-generated invoice.', 105, pageHeight - 10, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 105, pageHeight - 5, { align: 'center' });
  
  // Generate PDF blob and open in new tab, then download
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // Open in new tab
  const newWindow = window.open(pdfUrl, '_blank');
  if (newWindow) {
    newWindow.focus();
  }
  
  // Also trigger download
  doc.save(`Invoice-${order.order_code}.pdf`);
  
  // Clean up the blob URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 100);
}
