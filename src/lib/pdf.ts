import { formatDate } from "./schedule";

const HOSPITAL = "South Apollo Medical College Hospital";
const ADDRESS = "Jagua, Kalijira, Barishal Sadar, Barishal  |  +880 1913-240139";

async function doc() {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  pdf.setFont("helvetica", "bold").setFontSize(16).text(HOSPITAL, 105, 18, { align: "center" });
  pdf.setFont("helvetica", "normal").setFontSize(9).text(ADDRESS, 105, 24, { align: "center" });
  pdf.line(14, 28, 196, 28);
  return pdf;
}

export async function downloadReceipt(title: string, rows: [string, string][], fileName: string) {
  const pdf = await doc();
  const { default: autoTable } = await import("jspdf-autotable");
  pdf.setFont("helvetica", "bold").setFontSize(13).text(title, 14, 38);
  autoTable(pdf, { startY: 44, body: rows, theme: "grid", columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 } } });
  pdf.setFontSize(8).text("Please bring this slip and arrive 15 minutes early. Our team may call to confirm.", 14, 280);
  pdf.save(fileName);
}

export async function downloadManifest(title: string, date: string, head: string[], body: string[][], fileName: string) {
  const pdf = await doc();
  const { default: autoTable } = await import("jspdf-autotable");
  pdf.setFont("helvetica", "bold").setFontSize(13).text(title, 14, 38);
  pdf.setFont("helvetica", "normal").setFontSize(10).text(formatDate(date), 14, 44);
  autoTable(pdf, { startY: 50, head: [head], body: body.length ? body : [[`No entries`, ...head.slice(1).map(() => "")]], headStyles: { fillColor: [17, 36, 84] }, styles: { fontSize: 9 } });
  pdf.save(fileName);
}
