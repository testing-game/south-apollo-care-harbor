import type { jsPDF as JsPDF } from "jspdf";
import type { CellHookData } from "jspdf-autotable";
import brownRegular from "@/assets/fonts/BrownPro-Regular.ttf.asset.json";
import brownBold from "@/assets/fonts/BrownPro-Bold.ttf.asset.json";
import { asset } from "./asset";
import { formatDate } from "./schedule";
import { PDF_BRAND as B, dhakaTimestamp, manifestColumns, manifestFilterLabel, manifestTitle, needsShaping, pageLabel, statusLabel, type ManifestKind } from "./pdf-model";

type RGB = readonly [number, number, number];
const FONT = "BrownPro";
const PT = 0.3528; // millimetres per point
const PX_PER_MM = 12; // ~300 dpi for Bengali text drawn by the browser
const WHITE: RGB = [255, 255, 255];
const SKY_TINT: RGB = [240, 249, 255];
const STATUS_COLORS: Record<string, RGB> = { PENDING: [180, 83, 9], CONFIRMED: [15, 118, 110], COMPLETED: B.navy, CANCELLED: [185, 28, 28] };

/* ---------- assets ---------- */

let assets: Promise<{ regular: string; bold: string; logo: string }> | null = null;

async function base64(url: string) {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let out = "";
  for (let i = 0; i < bytes.length; i += 0x8000) out += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(out);
}

function loadAssets() {
  assets ??= Promise.all([base64(brownRegular.url), base64(brownBold.url), base64(asset("pdf-logo.jpg"))])
    .then(([regular, bold, logo]) => ({ regular, bold, logo: `data:image/jpeg;base64,${logo}` }))
    .catch((e: unknown) => { assets = null; throw e; });
  return assets;
}

async function webFontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.allSettled(["400", "700"].flatMap((w) => [document.fonts.load(`${w} 20px "Hind Siliguri"`, "অআকি৳"), document.fonts.load(`${w} 20px BrownPro`, "A")]));
}

async function createDoc(orientation: "portrait" | "landscape", title: string) {
  const [{ jsPDF }, a] = await Promise.all([import("jspdf"), loadAssets(), webFontsReady()]);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation });
  pdf.addFileToVFS("BrownPro-Regular.ttf", a.regular);
  pdf.addFont("BrownPro-Regular.ttf", FONT, "normal");
  pdf.addFileToVFS("BrownPro-Bold.ttf", a.bold);
  pdf.addFont("BrownPro-Bold.ttf", FONT, "bold");
  pdf.setFont(FONT, "normal");
  pdf.setProperties({ title, author: B.hospital, creator: B.hospital });
  return { pdf, logo: a.logo, W: pdf.internal.pageSize.getWidth(), H: pdf.internal.pageSize.getHeight() };
}

/* ---------- text ---------- */

type TextOpts = { size: number; bold?: boolean; color?: RGB; align?: "left" | "center" | "right"; maxWidth?: number };
type Shaped = { data: string; w: number; h: number };
const shapedCache = new Map<string, Shaped>();

/** Bengali (and other non-Latin) text is shaped by the browser with Hind Siliguri and placed as a crisp image, so conjuncts and vowel signs render correctly. */
function shape(text: string, o: TextOpts): Shaped {
  const key = `${text}|${o.size}|${o.bold}|${o.color}|${o.maxWidth}`;
  const hit = shapedCache.get(key);
  if (hit) return hit;
  const px = o.size * PT * PX_PER_MM;
  const font = `${o.bold ? 700 : 400} ${px}px BrownPro, "Hind Siliguri", sans-serif`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const max = o.maxWidth ? o.maxWidth * PX_PER_MM : Infinity;
  const lines: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && ctx.measureText(`${last} ${word}`).width <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  const lh = px * 1.55;
  canvas.width = Math.ceil(Math.max(1, ...lines.map((l) => ctx.measureText(l).width))) + 4;
  canvas.height = Math.ceil(lh * lines.length);
  ctx.font = font;
  ctx.fillStyle = `rgb(${(o.color ?? B.ink).join(",")})`;
  ctx.textBaseline = "middle";
  lines.forEach((l, i) => ctx.fillText(l, 0, lh * (i + 0.5)));
  const out = { data: canvas.toDataURL("image/png"), w: canvas.width / PX_PER_MM, h: canvas.height / PX_PER_MM };
  shapedCache.set(key, out);
  return out;
}

/** Draws text with its top edge at y and returns the block height in mm. */
function write(pdf: JsPDF, text: string, x: number, y: number, o: TextOpts, dry = false): number {
  const align = o.align ?? "left";
  if (needsShaping(text)) {
    const s = shape(text, o);
    if (!dry) pdf.addImage(s.data, "PNG", align === "right" ? x - s.w : align === "center" ? x - s.w / 2 : x, y, s.w, s.h);
    return s.h;
  }
  pdf.setFont(FONT, o.bold ? "bold" : "normal").setFontSize(o.size).setTextColor(...(o.color ?? B.ink));
  const lines: string[] = o.maxWidth ? pdf.splitTextToSize(text, o.maxWidth) : [text];
  const lh = o.size * PT * 1.3;
  if (!dry) lines.forEach((l, i) => pdf.text(l, x, y + lh * (i + 0.5), { align, baseline: "middle" }));
  return lh * lines.length;
}

function textWidth(pdf: JsPDF, text: string, size: number, bold = false) {
  return pdf.setFont(FONT, bold ? "bold" : "normal").setFontSize(size).getTextWidth(text);
}

/* ---------- shared brand blocks ---------- */

function brandHeader(pdf: JsPDF, logo: string, W: number, M: number): number {
  pdf.setFillColor(...B.navy).rect(0, 0, W, 3.2, "F");
  pdf.setFillColor(...B.teal).rect(0, 3.2, W, 0.9, "F");
  pdf.addImage(logo, "JPEG", M, 9, 22, 22);
  pdf.setDrawColor(...B.teal).setLineWidth(0.7).line(M + 26.5, 11, M + 26.5, 29);
  const x = M + 31;
  write(pdf, B.hospital, x, 10.5, { size: 15, bold: true, color: B.navy });
  write(pdf, B.address, x, 18, { size: 9, color: B.muted });
  write(pdf, "24/7 Helpline", x, 23.2, { size: 9, bold: true, color: B.teal });
  write(pdf, B.helpline, x + textWidth(pdf, "24/7 Helpline", 9, true) + 2.5, 23.2, { size: 9, bold: true, color: B.navy });
  pdf.setDrawColor(...B.border).setLineWidth(0.3).line(M, 35, W - M, 35);
  pdf.setDrawColor(...B.teal).setLineWidth(0.9).line(M, 35, M + 36, 35);
  return 35;
}

function brandBar(pdf: JsPDF, W: number, H: number) {
  pdf.setFillColor(...B.teal).rect(0, H - 8.9, W, 0.9, "F");
  pdf.setFillColor(...B.navy).rect(0, H - 8, W, 8, "F");
  write(pdf, `${B.hospital}   ·   ${B.address}   ·   24/7 Helpline ${B.helpline}`, W / 2, H - 6, { size: 7.5, color: WHITE, align: "center" });
}

/* ---------- patient slips ---------- */

export type SlipInput = {
  kind: "appointment" | "test";
  number: string;
  status: string;
  bookedAt: Date;
  patient: { name: string; phone: string; age: string | number; gender: string };
  /** Consultation or package rows, label → value. */
  details: [string, string][];
  fileName: string;
};

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

function infoCard(pdf: JsPDF, x: number, y: number, w: number, title: string, rows: [string, string][], height: number | null): number {
  const pad = 5;
  const rowH = (v: string) => 3.6 + 1.2 + write(pdf, v, 0, 0, { size: 10.5, bold: true, maxWidth: w - pad * 2 }, true) + 3.6;
  const total = 9 + 3 + rows.reduce((s, [, v]) => s + rowH(v), 0);
  if (height === null) return total;
  pdf.setFillColor(...WHITE).setDrawColor(...B.border).setLineWidth(0.3).roundedRect(x, y, w, height, 2.5, 2.5, "FD");
  pdf.setFillColor(...B.navy).roundedRect(x, y, w, 9, 2.5, 2.5, "F").rect(x, y + 5, w, 4, "F");
  write(pdf, title, x + pad, y + 2.45, { size: 8.8, bold: true, color: WHITE });
  let cy = y + 12;
  rows.forEach(([label, value], i) => {
    write(pdf, label.toUpperCase(), x + pad, cy, { size: 7.4, bold: true, color: B.muted });
    const vh = write(pdf, value || "—", x + pad, cy + 4.8, { size: 10.5, bold: true, color: B.navy, maxWidth: w - pad * 2 });
    cy += 4.8 + vh + 3.6;
    if (i < rows.length - 1) pdf.setDrawColor(...B.border).setLineWidth(0.2).line(x + pad, cy - 1.8, x + w - pad, cy - 1.8);
  });
  return height;
}

export async function buildSlip(input: SlipInput) {
  const appt = input.kind === "appointment";
  const title = appt ? "Doctor Appointment Slip" : "Health Check Booking Slip";
  const { pdf, logo, W, H } = await createDoc("portrait", `${title} ${input.number}`);
  const M = 14;
  const CW = W - M * 2;
  let y = brandHeader(pdf, logo, W, M) + 8;

  write(pdf, title, M, y, { size: 17, bold: true, color: B.navy });
  write(pdf, "Please keep this slip and show it at the reception desk on your visit.", M, y + 8, { size: 9.5, color: B.muted });
  y += 17;

  // Highlight box: booking number, status, timestamp
  const boxH = 27;
  pdf.setFillColor(...B.slateFill).setDrawColor(...B.border).setLineWidth(0.3).roundedRect(M, y, CW, boxH, 2.5, 2.5, "FD");
  pdf.setFillColor(...B.teal).roundedRect(M + 5, y + 5, 1.3, boxH - 10, 0.65, 0.65, "F");
  write(pdf, appt ? "APPOINTMENT NO." : "BOOKING NO.", M + 10, y + 5.5, { size: 7.8, bold: true, color: B.muted });
  pdf.setFillColor(...WHITE).setDrawColor(...B.tealSoft).setLineWidth(0.5);
  const numW = textWidth(pdf, input.number, 19, true) + 10;
  pdf.roundedRect(M + 10, y + 10.5, numW, 11, 1.8, 1.8, "FD");
  write(pdf, input.number, M + 15, y + 12.4, { size: 19, bold: true, color: B.navy });

  const status = statusLabel(input.status);
  const right = M + CW - 6;
  const pillW = textWidth(pdf, status, 8.5, true) + 10;
  const confirmed = status === "CONFIRMED" || status === "COMPLETED";
  pdf.setFillColor(...(confirmed ? B.teal : SKY_TINT)).setDrawColor(...B.teal).setLineWidth(0.4).roundedRect(right - pillW, y + 5, pillW, 7, 3.5, 3.5, "FD");
  write(pdf, status, right - pillW / 2, y + 6.7, { size: 8.5, bold: true, color: confirmed ? WHITE : B.navy, align: "center" });
  write(pdf, "Booked on", right, y + 14.5, { size: 7.8, color: B.muted, align: "right" });
  write(pdf, dhakaTimestamp(input.bookedAt), right, y + 18.6, { size: 9.5, bold: true, color: B.ink, align: "right" });
  y += boxH + 8;

  // Two-column info grid
  const gap = 6;
  const colW = (CW - gap) / 2;
  const p = input.patient;
  const patientRows: [string, string][] = [["Full Name", p.name], ["Phone Number", p.phone], ["Age", `${p.age} years`], ["Gender", cap(p.gender)]];
  const leftTitle = "PATIENT INFORMATION";
  const rightTitle = appt ? "CONSULTATION DETAILS" : "PACKAGE DETAILS";
  const cardH = Math.max(infoCard(pdf, 0, 0, colW, leftTitle, patientRows, null), infoCard(pdf, 0, 0, colW, rightTitle, input.details, null));
  infoCard(pdf, M, y, colW, leftTitle, patientRows, cardH);
  infoCard(pdf, M + colW + gap, y, colW, rightTitle, input.details, cardH);
  y += cardH + 8;

  // Important instructions
  const notes = [
    "Please arrive 15 minutes prior to your scheduled time and present this slip at the reception desk.",
    `Our team may call you on ${p.phone} to confirm your ${appt ? "appointment" : "booking"}.`,
    "Bring any previous prescriptions and medical reports with you.",
    `To change or cancel, call our 24/7 helpline: ${B.helpline}.`,
  ];
  const textW = CW - 18;
  const noteHs = notes.map((n) => write(pdf, n, 0, 0, { size: 9, maxWidth: textW }, true));
  const insH = 15 + noteHs.reduce((s, h) => s + h + 2, 0);
  pdf.setFillColor(...SKY_TINT).setDrawColor(...B.tealSoft).setLineWidth(0.4).roundedRect(M, y, CW, insH, 2.5, 2.5, "FD");
  pdf.setFillColor(...B.navy).circle(M + 8, y + 7.3, 2.6, "F");
  write(pdf, "i", M + 8, y + 5.5, { size: 9, bold: true, color: WHITE, align: "center" });
  write(pdf, "Important Instructions", M + 13, y + 5.2, { size: 10.5, bold: true, color: B.navy });
  let ny = y + 13;
  notes.forEach((n, i) => {
    pdf.setFillColor(...B.teal).circle(M + 10, ny + 2, 0.9, "F");
    write(pdf, n, M + 14, ny, { size: 9, color: B.ink, maxWidth: textW });
    ny += noteHs[i]! + 2;
  });

  write(pdf, "This is a computer-generated slip and does not require a signature.", M, H - 16, { size: 7.8, color: B.muted });
  write(pdf, `Generated ${dhakaTimestamp(new Date())}`, W - M, H - 16, { size: 7.8, color: B.muted, align: "right" });
  brandBar(pdf, W, H);
  return pdf;
}

export async function downloadSlip(input: SlipInput) {
  (await buildSlip(input)).save(input.fileName);
}

/* ---------- staff manifests ---------- */

export type ManifestRow = { number: string; name: string; phone: string; ageGender: string; item: string; status: string };
export type ManifestInput = {
  kind: ManifestKind;
  date: string;
  /** Selected doctor or package; empty means all. */
  filter?: string | null;
  statusFilter?: string | null;
  search?: string | null;
  rows: ManifestRow[];
  fileName: string;
};

const COL_WIDTHS = [12, 31, 50, 31, 25, 50, 24, 50] as const; // A4 landscape content width (273mm); last is Remarks / Signature
const CELL_PAD = { top: 2.8, bottom: 2.8, left: 2.4, right: 2.4 };

export async function buildManifest(input: ManifestInput) {
  const title = manifestTitle(input.kind);
  const { pdf, logo, W, H } = await createDoc("landscape", `${title} ${input.date}`);
  const { default: autoTable } = await import("jspdf-autotable");
  const M = 12;
  brandHeader(pdf, logo, W, M);
  write(pdf, "STAFF COPY — FOR RECEPTION USE", W - M, 12, { size: 7.8, bold: true, color: B.teal, align: "right" });

  write(pdf, title, M, 41, { size: 16, bold: true, color: B.navy });

  // Report summary strip
  const cells: [string, string][] = [
    ["REPORT DATE", formatDate(input.date)],
    [input.kind === "appointments" ? "DOCTOR" : "PACKAGE", manifestFilterLabel(input.kind, input.filter)],
    ["STATUS", input.statusFilter ? cap(input.statusFilter) : "All statuses"],
    ...(input.search ? [["SEARCH", `"${input.search}"`] as [string, string]] : []),
    ["TOTAL RECORDS", String(input.rows.length)],
  ];
  const sy = 50;
  const CW = W - M * 2;
  const weights = cells.map((_, i) => (i === 1 || cells[i]![0] === "SEARCH" ? 2 : 1));
  const unit = CW / weights.reduce((a, b) => a + b, 0);
  const valueOpts = (i: number): TextOpts => ({ size: 10, bold: true, color: i === cells.length - 1 ? B.teal : B.navy, maxWidth: unit * weights[i]! - 8 });
  const stripH = 9.6 + Math.max(...cells.map(([, v], i) => write(pdf, v, 0, 0, valueOpts(i), true)));
  pdf.setFillColor(...B.slateFill).setDrawColor(...B.border).setLineWidth(0.3).roundedRect(M, sy, CW, stripH, 2, 2, "FD");
  let cx = M;
  cells.forEach(([label, value], i) => {
    if (i) pdf.setDrawColor(...B.border).line(cx, sy + 3, cx, sy + stripH - 3);
    write(pdf, label, cx + 5, sy + 2.6, { size: 7, bold: true, color: B.muted });
    write(pdf, value, cx + 5, sy + 6.8, valueOpts(i));
    cx += unit * weights[i]!;
  });

  const body = input.rows.length
    ? input.rows.map((r, i) => [String(i + 1), r.number, r.name, r.phone, r.ageGender, r.item || "—", statusLabel(r.status), ""])
    : [[{ content: "No bookings for this date and these filters.", colSpan: 8, styles: { halign: "center" as const, textColor: [...B.muted] as [number, number, number] } }]];
  const shaped = new WeakMap<object, Shaped>();

  autoTable(pdf, {
    startY: sy + stripH + 6,
    margin: { left: M, right: M, top: 18, bottom: 26 },
    head: [manifestColumns(input.kind)],
    body,
    theme: "grid",
    showHead: "everyPage",
    styles: { font: FONT, fontStyle: "normal", fontSize: 9, textColor: [...B.ink], cellPadding: CELL_PAD, lineColor: [...B.border], lineWidth: 0.2, valign: "middle", overflow: "linebreak", minCellHeight: 10.6 },
    headStyles: { fillColor: [...B.navy], textColor: [...WHITE], fontStyle: "bold", fontSize: 8.6, lineColor: [...B.navy], minCellHeight: 9 },
    bodyStyles: { fillColor: [...WHITE] },
    alternateRowStyles: { fillColor: [...B.slateFill] },
    columnStyles: {
      0: { cellWidth: COL_WIDTHS[0], halign: "center", textColor: [...B.muted] },
      1: { cellWidth: COL_WIDTHS[1], fontStyle: "bold", textColor: [...B.navy] },
      2: { cellWidth: COL_WIDTHS[2], fontStyle: "bold" },
      3: { cellWidth: COL_WIDTHS[3] },
      4: { cellWidth: COL_WIDTHS[4] },
      5: { cellWidth: COL_WIDTHS[5] },
      6: { cellWidth: COL_WIDTHS[6], halign: "center", fontStyle: "bold", fontSize: 7.8 },
      7: { cellWidth: COL_WIDTHS[7] },
    },
    didParseCell: (d: CellHookData) => {
      if (d.section !== "body" || !input.rows.length) return;
      if (d.column.index === 6) d.cell.styles.textColor = [...(STATUS_COLORS[String(d.cell.raw)] ?? B.ink)];
      const raw = String(d.cell.raw ?? "");
      if (raw && needsShaping(raw)) {
        const width = ((COL_WIDTHS as readonly number[])[d.column.index] ?? 40) - CELL_PAD.left - CELL_PAD.right;
        const color = d.cell.styles.textColor as unknown as RGB;
        const s = shape(raw, { size: 9, bold: d.cell.styles.fontStyle === "bold", color: Array.isArray(color) ? color : B.ink, maxWidth: width });
        shaped.set(d.cell, s);
        d.cell.text = [""];
        d.cell.styles.minCellHeight = Math.max(10.6, s.h + CELL_PAD.top + CELL_PAD.bottom);
      }
    },
    didDrawCell: (d: CellHookData) => {
      const s = shaped.get(d.cell);
      if (s) pdf.addImage(s.data, "PNG", d.cell.x + CELL_PAD.left, d.cell.y + (d.cell.height - s.h) / 2, s.w, s.h);
    },
  });

  // Running header (pages 2+) and footer on every page
  const total = pdf.getNumberOfPages();
  const generated = `Generated: ${dhakaTimestamp(new Date())}`;
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i);
    if (i > 1) {
      pdf.setFillColor(...B.navy).rect(0, 0, W, 3.2, "F");
      pdf.setFillColor(...B.teal).rect(0, 3.2, W, 0.9, "F");
      write(pdf, `${B.hospital}  ·  ${title}`, M, 7.5, { size: 9, bold: true, color: B.navy });
      write(pdf, `${formatDate(input.date)}  ·  ${manifestFilterLabel(input.kind, input.filter)}`, W - M, 7.5, { size: 8.5, color: B.muted, align: "right" });
    }
    pdf.setDrawColor(...B.border).setLineWidth(0.3).line(M, H - 21, W - M, H - 21);
    write(pdf, generated, M, H - 15.5, { size: 8, color: B.muted });
    write(pdf, pageLabel(i, total), W / 2, H - 15.5, { size: 8, bold: true, color: B.navy, align: "center" });
    pdf.setDrawColor(...B.navy).setLineWidth(0.3).line(W - M - 62, H - 13.5, W - M, H - 13.5);
    write(pdf, "Authorized Signature", W - M - 31, H - 12.3, { size: 7.8, color: B.muted, align: "center" });
    pdf.setFillColor(...B.teal).rect(0, H - 4.9, W, 0.9, "F");
    pdf.setFillColor(...B.navy).rect(0, H - 4, W, 4, "F");
  }
  return pdf;
}

export async function downloadManifest(input: ManifestInput) {
  (await buildManifest(input)).save(input.fileName);
}
