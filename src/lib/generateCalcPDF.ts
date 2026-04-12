export interface CalcPDFData {
  calculatorName: string;
  inputs: { label: string; value: string }[];
  results: { label: string; value: string }[];
  insight?: string;
  generatedAt: string;
  url: string;
}

// jsPDF only supports basic Latin characters in its built-in Helvetica font.
// Map non-Latin currency symbols to PDF-safe alternatives (same approach as InvoiceGen).
const PDF_SAFE_REPLACEMENTS: [RegExp, string][] = [
  [/₹/g, "Rs."],
  [/¥/g, "Y"],
  [/₩/g, "W"],
  [/₱/g, "P"],
  [/₫/g, "VND "],
  [/₦/g, "N"],
  [/৳/g, "Tk"],
  [/₺/g, "TL"],
  [/฿/g, "B"],
  [/रू/g, "Rs."],
  [/€/g, "EUR "],
  [/£/g, "GBP "],
  [/—/g, "-"],
  [/→/g, "->"],
];

function sanitize(text: string): string {
  let s = text;
  for (const [pattern, replacement] of PDF_SAFE_REPLACEMENTS) {
    s = s.replace(pattern, replacement);
  }
  // Remove any remaining non-Latin-1 characters
  return s.replace(/[^\x00-\xFF]/g, "");
}

export async function generateCalcPDF(data: CalcPDFData): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header bar
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(sanitize(`CalcHub - ${data.calculatorName}`), margin, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(data.generatedAt, pageWidth - margin, 18, { align: "right" });

  y = 40;

  // Inputs section
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Inputs", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  for (const input of data.inputs) {
    doc.setTextColor(107, 114, 128);
    doc.text(sanitize(input.label), margin, y);
    doc.setTextColor(17, 24, 39);
    doc.text(sanitize(input.value), margin + contentWidth, y, { align: "right" });
    y += 7;
  }

  y += 6;

  // Results section
  const resultsHeight = data.results.length * 9 + 16;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y - 4, contentWidth, resultsHeight, 3, 3, "F");
  y += 4;

  doc.setTextColor(55, 65, 81);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Results", margin + 6, y);
  y += 9;

  doc.setFontSize(11);
  for (const result of data.results) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(sanitize(result.label), margin + 6, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(99, 102, 241);
    doc.text(sanitize(result.value), margin + contentWidth - 6, y, { align: "right" });
    y += 9;
  }

  y += 10;

  // Insight
  if (data.insight) {
    const insightText = sanitize(data.insight);
    const lines = doc.splitTextToSize(insightText, contentWidth - 12);
    const insightHeight = Math.max(20, lines.length * 5 + 10);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin, y - 4, contentWidth, insightHeight, 3, 3, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(67, 56, 202);
    doc.text(lines, margin + 6, y + 2);
    y += insightHeight;
  }

  y += 10;

  // Footer
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Generated at CalcHub - Free Online Calculators", margin, y);
  const urlText = data.url.length > 60 ? data.url.substring(0, 57) + "..." : data.url;
  doc.text(urlText, pageWidth - margin, y, { align: "right" });

  const filename = `calchub-${data.calculatorName.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}
