import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateInvoicePDF(invoice, client, items, taxes, brand) {
  const doc = new jsPDF("p", "pt", "a4");

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.split("T")[0]; 
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  let y = margin;

  const LOGO_W = 160;
  const LOGO_H = 60;

  const brandLogo = brand?.brandLogo || brand?.logo_url;

  if (brandLogo) {
    try {
      const blob = await fetch(brandLogo).then(r => r.blob());
      const imgData = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(blob);
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((r) => (img.onload = r));

      let w = img.width;
      let h = img.height;
      const scale = Math.min(LOGO_W / w, LOGO_H / h);
      w *= scale;
      h *= scale;

      const x = margin;
      const yL = y + (LOGO_H - h) / 2;

      doc.addImage(imgData, "PNG", x, yL, w, h);
    } catch {
      doc.text("LOGO", margin + 35, y + 35);
    }
  } else {
    doc.text("LOGO", margin + 35, y + 35);
  }

  const rightX = pageWidth - margin - 180;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TAX INVOICE", rightX, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoice.invoice_number}`, rightX, y + 35);

  doc.text(`Invoice Date: ${formatDate(invoice.invoice_date)}`, rightX, y + 50);
  doc.text(`Due Date: ${formatDate(invoice.due_date)}`, rightX, y + 65);

  y += 90;

  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(brand?.businessName || brand?.brandName || "Business Name", margin, y);

  y += 16;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  [
    brand?.address_line1,
    brand?.address_line2,
    brand?.country,
    brand?.gstin ? `GSTIN: ${brand.gstin}` : "",
    brand?.email,
    brand?.website
  ].filter(Boolean).forEach((line) => {
    doc.text(line, margin, y);
    y += 13;
  });

  y += 20;


  const billX = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Bill To", billX, y);

  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const billLines = [
    client?.name,
    client?.address?.street,
    client?.address?.city,
    `${client?.address?.state || ""} ${client?.address?.postalCode || ""}`.trim(),
    client?.address?.country,
    client?.gstNumber ? `GSTIN: ${client.gstNumber}` : ""
  ].filter(Boolean);

  billLines.forEach((line) => {
    doc.text(line, billX, y);
    y += 14;
  });

  y += 20;


  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Ship To", billX, y);

  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const shipAddress = client?.shippingAddress || client?.address;
  const shipLines = [
    client?.name,
    shipAddress?.street,
    shipAddress?.city,
    `${shipAddress?.state || ""} ${shipAddress?.postalCode || ""}`.trim(),
    shipAddress?.country
  ].filter(Boolean);

  shipLines.forEach((line) => {
    doc.text(line, billX, y);
    y += 14;
  });

  y += 25;



  const tableData = items.map((it, idx) => {
  const taxString = taxes.map(t => `${t.tax_percentage}%`).join(" + ");
  return [
    idx + 1,
    it.description,
    "998314",
    Number(it.quantity).toFixed(2),
    Number(it.unit_price).toFixed(2),
    taxString,
    Number(it.amount).toFixed(2)
  ];
});


  autoTable(doc, {
    startY: y,
    theme: "grid",
    tableWidth: "auto",
    head: [["#", "Item Description", "HSN", "Qty", "Rate", "Tax", "Amount"]],
    body: tableData,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: 255,
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      1: { cellWidth: 210 },
      2: { cellWidth: 60, halign: "center" },
      3: { cellWidth: 55, halign: "center" },
      4: { cellWidth: 70, halign: "right" },
      5: { cellWidth: 50, halign: "center" },
      6: { cellWidth: 70, halign: "right" }
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 20;


  const boxW = 260;
  const boxX = pageWidth - margin - boxW;

  doc.setDrawColor(180, 180, 180);
  doc.rect(boxX, y, boxW, 130);

  let tY = y + 18;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("Amount", boxX + 15, tY);
  doc.text(Number(invoice.amountForServices).toFixed(2), boxX + boxW - 15, tY, { align: "right" });

  tY += 18;

  taxes.forEach((tax) => {
  doc.text(`${tax.tax_name} ${tax.tax_percentage}%`, boxX + 15, tY);
  doc.text(Number(tax.tax_amount).toFixed(2), boxX + boxW - 15, tY, { align: "right" });
  tY += 18;
});

  doc.line(boxX, tY + 5, boxX + boxW, tY + 5);
  tY += 20;

  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", boxX + 15, tY);
  doc.text(Number(invoice.grand_total).toFixed(2), boxX + boxW - 15, tY, { align: "right" });

  y += 150;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Notes:", margin, y);
  doc.text("Thank you for your business!", margin, y + 15);

  y += 60;
  doc.text("Authorized Signature ___________________________", margin, y);

  doc.setFontSize(9);
  doc.text("Page 1", pageWidth / 2, pageHeight - 20, { align: "center" });

  return doc.output("blob");
}
