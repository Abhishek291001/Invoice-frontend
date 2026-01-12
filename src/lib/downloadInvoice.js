import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function downloadInvoice() {
  const element = document.getElementById("invoice");

  if (!element) {
    throw new Error("Invoice DOM not found");
  }

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();

  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("invoice.pdf");
}
