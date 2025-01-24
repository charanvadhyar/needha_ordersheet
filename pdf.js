async function exportToPDFWithPDFLib() {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const { width, height } = page.getSize();
        const blackColor = rgb(0, 0, 0);

        let y = height - 40; // Start from top margin

        // Form Data
        const formData = {
            date: document.getElementById("date")?.value || '',
            orderId: document.getElementById("orderId")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || '22K',
            orderType: document.getElementById("orderType")?.value || '',
            createdBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            totalWt: document.getElementById("totalWt")?.value || '',
            balanceMetal: document.getElementById("balance")?.value || '',
        };

        // Add Header
        page.drawText("Needha Gold Order Sheet", {
            x: width / 2 - 100,
            y,
            size: 14,
            font: boldFont,
            color: blackColor,
        });
        y -= 20;

        // Add Order Details
        const details = [
            { label: "Date:", value: formData.date },
            { label: "Order ID:", value: formData.orderId },
            { label: "Party Name:", value: formData.partyName },
            { label: "Purity:", value: formData.purity },
            { label: "Order Type:", value: formData.orderType },
            { label: "Created By:", value: formData.createdBy },
            { label: "Delivery Date:", value: formData.deliveryDate },
            { label: "Advance Metal:", value: formData.advanceMetal },
            { label: "Total Wt:", value: formData.totalWt },
            { label: "Balance Metal:", value: formData.balanceMetal },
        ];

        details.forEach((detail) => {
            page.drawText(`${detail.label} ${detail.value}`, {
                x: 50,
                y,
                size: 10,
                font,
                color: blackColor,
            });
            y -= 15;
        });

        y -= 10; // Add spacing before the table

        // Table Headers
        const tableHeaders = [
            "Sl.No",
            "Item Name",
            "Category",
            "Purity",
            "Size",
            "Color",
            "Quantity",
            "Gross Wt",
            "Stone Wt",
            "Net Wt",
            "Remark",
        ];

        let x = 50;
        const colWidths = [40, 70, 70, 50, 50, 50, 50, 50, 50, 50, 100]; // Column widths
        let currentX = x;

        // Draw table header with borders
        tableHeaders.forEach((header, index) => {
            page.drawRectangle({
                x: currentX,
                y: y,
                width: colWidths[index],
                height: 20,
                borderColor: blackColor,
                borderWidth: 1,
            });
            page.drawText(header, {
                x: currentX + 5,
                y: y + 5,
                size: 8,
                font: boldFont,
                color: blackColor,
            });
            currentX += colWidths[index];
        });

        y -= 20; // Move to the next row

        // Table Data
        const tbody = document.getElementById("order-rows").parentNode;
        const orderRows = tbody.querySelectorAll(".order-row");
        let totalQuantity = 0,
            totalGrossWt = 0,
            totalStoneWt = 0,
            totalNetWt = 0;

        for (const [index, row] of orderRows.entries()) {
            currentX = x; // Reset x for each row

            // Collect row data
            const quantity = parseFloat(row.querySelector(".quantity")?.value) || 0;
            const grossWt = parseFloat(row.querySelector(".grossWt")?.value) || 0;
            const stoneWt = parseFloat(row.querySelector(".stoneWt")?.value) || 0;
            const netWt = parseFloat(row.querySelector(".netWt")?.value) || 0;

            totalQuantity += quantity;
            totalGrossWt += grossWt;
            totalStoneWt += stoneWt;
            totalNetWt += netWt;

            const rowData = [
                (index + 1).toString(),
                row.querySelector(".itemName")?.value || '',
                row.querySelector(".category")?.value || '',
                row.querySelector(".purity")?.value || '',
                row.querySelector(".size")?.value || '',
                row.querySelector(".color")?.value || '',
                quantity.toFixed(3),
                grossWt.toFixed(3),
                stoneWt.toFixed(3),
                netWt.toFixed(3),
                row.querySelector(".remark")?.value || '',
            ];

            // Draw row with borders
            rowData.forEach((value, i) => {
                page.drawRectangle({
                    x: currentX,
                    y: y,
                    width: colWidths[i],
                    height: 20,
                    borderColor: blackColor,
                    borderWidth: 1,
                });
                page.drawText(value, {
                    x: currentX + 5,
                    y: y + 5,
                    size: 8,
                    font,
                    color: blackColor,
                });
                currentX += colWidths[i];
            });

            y -= 20; // Move to the next row

            // Add a new page if content overflows
            if (y < 50) {
                page.drawText("Continued on next page...", {
                    x: 50,
                    y,
                    size: 10,
                    font,
                    color: blackColor,
                });
                page = pdfDoc.addPage([841.89, 595.28]); // Add a new page
                y = height - 40; // Reset y position
            }
        }

        // Add Totals Row
        const totals = [
            "Total",
            "",
            "",
            "",
            "",
            "",
            totalQuantity.toFixed(3),
            totalGrossWt.toFixed(3),
            totalStoneWt.toFixed(3),
            totalNetWt.toFixed(3),
            "",
        ];

        currentX = x;
        totals.forEach((value, i) => {
            page.drawRectangle({
                x: currentX,
                y: y,
                width: colWidths[i],
                height: 20,
                borderColor: blackColor,
                borderWidth: 1,
            });
            page.drawText(value, {
                x: currentX + 5,
                y: y + 5,
                size: 8,
                font: boldFont,
                color: blackColor,
            });
            currentX += colWidths[i];
        });

        y -= 30; // Add spacing for footer

        // Footer
        page.drawText("Order Approved By: ____________________", {
            x: 50,
            y,
            size: 10,
            font,
            color: blackColor,
        });
        page.drawText("Authorised By: ____________________", {
            x: 500,
            y,
            size: 10,
            font,
            color: blackColor,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "NeedhaGold_Order.pdf";
        link.click();
    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("An error occurred while generating the PDF. Check console for details.");
    }
}
