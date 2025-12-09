import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export const ExportService = {
    // --- PDF Export ---
    exportToPDF: (reportTitle, headers, data, fileName = "report.pdf") => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(reportTitle, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        const dateStr = new Date().toLocaleDateString();
        doc.text(`Generated on: ${dateStr}`, 14, 30);

        // Table
        doc.autoTable({
            head: [headers],
            body: data.map(Object.values), // Assumes data object keys match header order
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102] }, // Marine Blue
            styles: { fontSize: 10, cellPadding: 3 },
        });

        // Save
        doc.save(fileName);
    },

    // --- Excel Export ---
    exportToExcel: (reportTitle, data, fileName = "report.xlsx") => {
        // Create Worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Create Workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Save
        XLSX.writeFile(wb, fileName);
    }
};
