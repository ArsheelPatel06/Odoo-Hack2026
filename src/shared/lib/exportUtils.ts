import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportToCSV(filename: string, headers: string[], data: unknown[][]) {
  const csvContent = [
    headers.join(","),
    ...data.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(filename: string, title: string, headers: string[], data: unknown[][]) {
  const doc = new jsPDF("landscape");
  
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 22);

  // @ts-expect-error
  doc.autoTable({
    startY: 28,
    head: [headers],
    body: data,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
  });

  doc.save(`${filename}.pdf`);
}
