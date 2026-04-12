export interface CSVData {
  calculatorName: string;
  headers: string[];
  rows: (string | number)[][];
}

/** Escape a cell value for CSV: wrap in quotes if it contains commas, quotes, or newlines */
function escapeCell(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSV(data: CSVData): void {
  const headerLine = data.headers.map(escapeCell).join(",");
  const bodyLines = data.rows.map((row) => row.map(escapeCell).join(","));
  const csvContent = [headerLine, ...bodyLines].join("\r\n");

  // UTF-8 BOM so Excel correctly displays currency symbols (₹, €, £, etc.)
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  const filename = `calchub-${data.calculatorName.toLowerCase().replace(/\s+/g, "-")}.csv`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
