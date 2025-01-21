function addRow() {
    // Get the tbody that contains the order rows
    const tbody = document.getElementById("order-rows").parentNode;

    // Get only the rows after the "Order Details Section" header
    const startRow = document.getElementById("order-rows");
    const orderRows = tbody.querySelectorAll('tr[id="order-rows"], tr:not([id]):nth-child(n+' + (startRow.rowIndex + 1) + ')');

    const serialNumber = orderRows.length + 1;

    // Insert a new row
    const row = tbody.insertRow();

    // Add input fields in each cell of the new row
    row.innerHTML = `
        <td>${serialNumber}</td>
        <td><input type="text" class="itemName" placeholder="Item Name"></td>
        <td><input type="text" class="category" placeholder="Category"></td>
        <td><input type="text" class="purity" placeholder="Purity"></td>
        <td><input type="text" class="size" placeholder="Size"></td>
        <td><input type="text" class="color" placeholder="Color"></td>
        <td><input type="number" class="quantity" placeholder="Quantity"></td>
        <td><input type="number" class="grossWt" placeholder="Gross Wt"></td>
        <td><input type="number" class="stoneWt" placeholder="Stone Wt"></td>
        <td><input type="number" class="netWt" placeholder="Net Wt" readonly></td>
        <td><input type="text" class="remark" placeholder="Remark"></td>
        <td class="file-upload-cell">
            <label for="file-${serialNumber}" class="file-upload-label">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Upload Image</span>
                <input type="file" id="file-${serialNumber}" accept="image/*" class="file-input" onchange="handleImageUpload(this)">
            </label>
        </td>
    `;

    // Add event listeners to calculate Net Weight
    const grossWtInput = row.querySelector(".grossWt");
    const stoneWtInput = row.querySelector(".stoneWt");
    const netWtInput = row.querySelector(".netWt");

    const updateNetWeight = () => {
        const grossWt = parseFloat(grossWtInput.value) || 0;
        const stoneWt = parseFloat(stoneWtInput.value) || 0;
        netWtInput.value = (grossWt - stoneWt).toFixed(3);
        updateTotals(); // Recalculate totals
    };

    grossWtInput.addEventListener("input", updateNetWeight);
    stoneWtInput.addEventListener("input", updateNetWeight);

    // Recalculate totals when Gross Weight changes
    grossWtInput.addEventListener("input", updateTotals);

    document.addEventListener('DOMContentLoaded', function() {
    const initialFileCell = document.querySelector('#order-rows td:last-child');
    if (initialFileCell) {
        initialFileCell.className = 'file-upload-cell';
        initialFileCell.innerHTML = `
            <label for="file-1" class="file-upload-label">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Upload Image</span>
                <input type="file" id="file-1" accept="image/*" class="file-input" onchange="handleImageUpload(this)">
            </label>
        `;
    }
});

function updateTotals() {
    // Calculate Total Weight and Balance
    const grossWeights = document.querySelectorAll(".grossWt");
    const advanceMetal = parseFloat(document.getElementById("advanceMetal")?.value) || 0;

    let totalWeight = 0;

    grossWeights.forEach((input) => {
        totalWeight += parseFloat(input.value) || 0;
    });

    document.getElementById("totalWt").value = totalWeight.toFixed(3);
    document.getElementById("balance").value = (totalWeight - advanceMetal).toFixed(3);
}

// Update the initial row in your HTML to calculate Net Weight and Total Weight
document.addEventListener("DOMContentLoaded", function () {
    const grossWtInput = document.querySelector("#order-rows .grossWt");
    const stoneWtInput = document.querySelector("#order-rows .stoneWt");
    const netWtInput = document.querySelector("#order-rows .netWt");

    if (grossWtInput && stoneWtInput && netWtInput) {
        const updateNetWeight = () => {
            const grossWt = parseFloat(grossWtInput.value) || 0;
            const stoneWt = parseFloat(stoneWtInput.value) || 0;
            netWtInput.value = (grossWt - stoneWt).toFixed(3);
            updateTotals(); // Recalculate totals
        };

        grossWtInput.addEventListener("input", updateNetWeight);
        stoneWtInput.addEventListener("input", updateNetWeight);

        // Recalculate totals when Gross Weight or Advance Metal changes
        grossWtInput.addEventListener("input", updateTotals);
        document.getElementById("advanceMetal").addEventListener("input", updateTotals);
    }
});



function submitForm() {
    try {
        // Get form values with error checking
        const formData = {
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || "22K",
            orderId: document.getElementById("orderId")?.value || '',
            orderType: document.getElementById("orderType")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            deliveryInstructions: document.getElementById("deliveryInstructions")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            totalWt: document.getElementById("totalWt")?.value || '',
            balance: document.getElementById("balance")?.value || ''
        };

        // Get order details from the table rows
        const tbody = document.getElementById("order-rows").parentNode;
        const startRow = document.getElementById("order-rows");
        const orderRows = tbody.querySelectorAll('tr[id="order-rows"], tr:not([id]):nth-child(n+' + (startRow.rowIndex + 1) + ')');
        
        let orders = "";
        let totalQuantity = 0, totalGrossWt = 0, totalStoneWt = 0, totalNetWt = 0;

        orderRows.forEach((row, index) => {
            try {
                const itemName = row.querySelector('.itemName')?.value || '';
                const category = row.querySelector('.category')?.value || '';
                const rowPurity = row.querySelector('.purity')?.value || '';
                const size = row.querySelector('.size')?.value || '';
                const color = row.querySelector('.color')?.value || '';
                const quantity = parseFloat(row.querySelector('.quantity')?.value) || 0;
                const grossWt = parseFloat(row.querySelector('.grossWt')?.value) || 0;
                const stoneWt = parseFloat(row.querySelector('.stoneWt')?.value) || 0;
                const netWt = parseFloat(row.querySelector('.netWt')?.value) || 0;
                const remark = row.querySelector('.remark')?.value || '';

                // Get image data
                const fileInput = row.querySelector('.file-input');
                const imageData = fileInput?.dataset.imageData;
                const imageHtml = imageData ? 
                    `<img src="${imageData}" style="max-width: 100px; max-height: 100px;">` : 
                    'No Image';

                // Update totals
                totalQuantity += quantity;
                totalGrossWt += grossWt;
                totalStoneWt += stoneWt;
                totalNetWt += netWt;

                orders += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${itemName}</td>
                        <td>${category}</td>
                        <td>${rowPurity}</td>
                        <td>${size}</td>
                        <td>${color}</td>
                        <td>${quantity.toFixed(3)}</td>
                        <td>${grossWt.toFixed(3)}</td>
                        <td>${stoneWt.toFixed(3)}</td>
                        <td>${netWt.toFixed(3)}</td>
                        <td>${remark}</td>
                        <td>${imageHtml}</td>
                    </tr>
                `;
            } catch (err) {
                console.error('Error processing row:', err);
            }
        });

        // Create the table HTML with updated structure
        const tableHTML = `
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th colspan="12" style="text-align: center; font-size: 16px; padding: 10px;">
                        Needha Gold Order Sheet
                    </th>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td>${formData.date}</td>
                    <td>Party Name:-</td>
                    <td colspan="2">${formData.partyName}</td>
                    <td>Purity:- ${formData.purity}</td>
                    <td>Order id:-</td>
                    <td>${formData.orderId}</td>
                    <td>Order Type:-</td>
                    <td colspan="3">${formData.orderType}</td>
                </tr>
                <tr>
                    <td colspan="6">Delivery Instructions:-</td>
                    <td colspan="3">Delivery Date:- ${formData.deliveryDate}</td>
                    <td colspan="3">Order By:- ${formData.orderBy}</td>
                </tr>
                <tr>
                    <td style="width: 120px;">Advance Metal:-</td>
                    <td colspan="4" style="text-align: left; padding-left: 10px;">${formData.advanceMetal}</td>
                    <td>Total Wt:-</td>
                    <td>${totalQuantity.toFixed(3)}</td>
                    <td>${totalGrossWt.toFixed(3)}</td>
                    <td>${totalStoneWt.toFixed(3)}</td>
                    <td>${totalNetWt.toFixed(3)}</td>
                    <td colspan="2">Balance:- ${formData.balance}</td>
                </tr>
                <tr>
                    <th>Sl.No</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Purity</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Quantity</th>
                    <th>Gross Wt</th>
                    <th>Stone Wt</th>
                    <th>Net Wt</th>
                    <th>Remark</th>
                    <th>Image</th>
                </tr>
                ${orders}
                <tr>
                    <th colspan="6">Total</th>
                    <td>${totalQuantity.toFixed(3)}</td>
                    <td>${totalGrossWt.toFixed(3)}</td>
                    <td>${totalStoneWt.toFixed(3)}</td>
                    <td>${totalNetWt.toFixed(3)}</td>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: left; padding: 20px;">Order Approval By:</td>
                    <td colspan="6" style="text-align: right; padding: 20px;">Authorised By:</td>
                </tr>
            </table>
        `;

        document.getElementById("generatedTableContainer").innerHTML = tableHTML;
    } catch (err) {
        console.error('Error in submitForm:', err);
        alert('Error generating table. Please check the console for details.');
    }
}

/*async function exportToExcel() {
    try {
        // First check if the table exists
        const generatedTable = document.querySelector("#generatedTableContainer table");
        if (!generatedTable) {
            alert("Please generate the table first by clicking Submit!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Order Sheet');

        // Get values directly from input fields
        const formData = {
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || '',
            orderId: document.getElementById("orderId")?.value || '',
            orderType: document.getElementById("orderType")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            balance: document.getElementById("balance")?.value || ''
        };

        // Define border style
        const borderStyle = {
            top: { style: 'thick' },
            left: { style: 'thick' },
            bottom: { style: 'thick' },
            right: { style: 'thick' }
        };

        // Set column widths
        worksheet.columns = [
            { width: 8 },     // Sl.No
            { width: 20 },    // Item Name
            { width: 15 },    // Category
            { width: 10 },    // Purity
            { width: 10 },    // Size
            { width: 12 },    // Color
            { width: 12 },    // Quantity
            { width: 12 },    // Gross Wt
            { width: 12 },    // Stone Wt
            { width: 12 },    // Net Wt
            { width: 15 },    // Remark
            { width: 15 }     // Image
        ];

        // Add rows one by one with proper styling
        // Title row
        const titleRow = worksheet.addRow(['Needha Gold Order Sheet']);
        worksheet.mergeCells(1, 1, 1, 12);  // Merge A1:L1
        titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        titleRow.getCell(1).font = { bold: true, size: 16 };
        titleRow.height = 25;

        // Date, Party Name row
        const row2 = worksheet.addRow([
            'Date:', formData.date, 'Party Name:-', formData.partyName, '', '',
            'Purity:-', formData.purity, 'Order ID:-', formData.orderId, 'Order Type:-', formData.orderType
        ]);
        worksheet.mergeCells(2, 4, 2, 5);  // Merge D2:E2 for Party Name
        worksheet.mergeCells(2, 10, 2, 12); // Merge J2:L2 for Order Type
        row2.height = 25;
        row2.eachCell(cell => {
            cell.border = borderStyle;
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Delivery Instructions row
        const row3 = worksheet.addRow([
            'Delivery Instructions:-', formData.deliveryInstructions, '', '', '', '',
            'Delivery Date:-', formData.deliveryDate, '',
            'Order By:-', formData.orderBy, ''
        ]);
        worksheet.mergeCells(3, 1, 3, 6);  // Merge A3:F3 for Delivery Instructions
        worksheet.mergeCells(3, 7, 3, 9);  // Merge G3:I3 for Delivery Date
        worksheet.mergeCells(3, 10, 3, 12); // Merge J3:L3 for Order By
        row3.height = 25;
        row3.eachCell(cell => {
            cell.border = borderStyle;
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Advance Metal row
        const row4 = worksheet.addRow([
            'Advance Metal:-', formData.advanceMetal, '', '', '',
            'Total Wt:-', '', '', '', '',
            'Balance:-', formData.balance
        ]);
        worksheet.mergeCells(4, 1, 4, 5);  // Merge A4:E4 for Advance Metal
        worksheet.mergeCells(4, 11, 4, 12); // Merge K4:L4 for Balance
        row4.height = 25;
        row4.eachCell(cell => {
            cell.border = borderStyle;
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Get order details from the input fields
        const orderRows = document.querySelectorAll('tr[id="order-rows"], tr:not([id]):nth-child(n+' + (document.getElementById("order-rows").rowIndex + 1) + ')');
        
        // Add header row for order details
        worksheet.addRow([
            'Sl.No', 'Item Name', 'Category', 'Purity', 'Size', 'Color',
            'Quantity', 'Gross Wt', 'Stone Wt', 'Net Wt', 'Remark', 'Image'
        ]);

        // Add order detail rows
        orderRows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.querySelector('.itemName')?.value || '',
                row.querySelector('.category')?.value || '',
                row.querySelector('.purity')?.value || '',
                row.querySelector('.size')?.value || '',
                row.querySelector('.color')?.value || '',
                row.querySelector('.quantity')?.value || '0',
                row.querySelector('.grossWt')?.value || '0',
                row.querySelector('.stoneWt')?.value || '0',
                row.querySelector('.netWt')?.value || '0',
                row.querySelector('.remark')?.value || '',
                '' // Image placeholder
            ];
            worksheet.addRow(rowData);
        });

        // Calculate totals from input values
        let totalQuantity = 0, totalGrossWt = 0, totalStoneWt = 0, totalNetWt = 0;
        orderRows.forEach(row => {
            totalQuantity += parseFloat(row.querySelector('.quantity')?.value || 0);
            totalGrossWt += parseFloat(row.querySelector('.grossWt')?.value || 0);
            totalStoneWt += parseFloat(row.querySelector('.stoneWt')?.value || 0);
            totalNetWt += parseFloat(row.querySelector('.netWt')?.value || 0);
        });

        // Add totals row
        worksheet.addRow([
            'Total', '', '', '', '', '',
            totalQuantity.toFixed(3),
            totalGrossWt.toFixed(3),
            totalStoneWt.toFixed(3),
            totalNetWt.toFixed(3),
            '', ''
        ]);

        // Add approval row
        const approvalRow = worksheet.addRow([
            'Order Approval By:', '', '', '', '', '',
            'Authorised By:', '', '', '', '', ''
        ]);
        
        worksheet.mergeCells(`A${approvalRow.number}:F${approvalRow.number}`);
        worksheet.mergeCells(`G${approvalRow.number}:L${approvalRow.number}`);
        approvalRow.height = 35;
        approvalRow.eachCell((cell, colNumber) => {
            cell.border = borderStyle;
            cell.font = { bold: true };
            if (colNumber === 1) {
                cell.alignment = { vertical: 'top', horizontal: 'left', indent: 1 };
            } else if (colNumber === 7) {
                cell.alignment = { vertical: 'top', horizontal: 'right', indent: 1 };
            }
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'NeedhaGold_Order.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error in exportToExcel:', error);
        console.log('Detailed error:', {
            message: error.message,
            stack: error.stack
        });
        alert('Error generating Excel file. Please check the console for details.');
    }
}*/
async function exportToPDF() {
    try {
        // Create new jsPDF instance
        const doc = new jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // Collect form data
        const formData = {
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || "22K",
            orderId: document.getElementById("orderId")?.value || '',
            orderType: document.getElementById("orderType")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            totalWt: document.getElementById("totalWt")?.value || '',
            balance: document.getElementById("balance")?.value || ''
        };

        // Add Title
        doc.setFontSize(18);
        doc.text("Needha Gold Order Sheet", 150, 15, { align: "center" });

        // Add General Information
        doc.setFontSize(10);
        const startY = 25;
        const lineHeight = 8;
        
        doc.text(`Date: ${formData.date}`, 10, startY);
        doc.text(`Party Name: ${formData.partyName}`, 80, startY);
        doc.text(`Purity: ${formData.purity}`, 150, startY);
        doc.text(`Order ID: ${formData.orderId}`, 200, startY);
        
        doc.text(`Order Type: ${formData.orderType}`, 10, startY + lineHeight);
        doc.text(`Order By: ${formData.orderBy}`, 80, startY + lineHeight);
        doc.text(`Delivery Date: ${formData.deliveryDate}`, 150, startY + lineHeight);
        
        doc.text(`Advance Metal: ${formData.advanceMetal}`, 10, startY + lineHeight * 2);
        doc.text(`Balance: ${formData.balance}`, 150, startY + lineHeight * 2);

        // Get order details
        const tbody = document.getElementById("order-rows").parentNode;
        const startRow = document.getElementById("order-rows");
        const orderRows = tbody.querySelectorAll('tr[id="order-rows"], tr:not([id]):nth-child(n+' + (startRow.rowIndex + 1) + ')');

        // Prepare table data
        const tableData = [];
        let totalQuantity = 0, totalGrossWt = 0, totalStoneWt = 0, totalNetWt = 0;

        // Image dimensions and aspect ratio
        const imageDimension = { width: 20, height: 20 }; // Fixed dimensions for images

        // Process each row
        orderRows.forEach((row, index) => {
            const quantity = parseFloat(row.querySelector('.quantity')?.value) || 0;
            const grossWt = parseFloat(row.querySelector('.grossWt')?.value) || 0;
            const stoneWt = parseFloat(row.querySelector('.stoneWt')?.value) || 0;
            const netWt = parseFloat(row.querySelector('.netWt')?.value) || 0;

            // Update totals
            totalQuantity += quantity;
            totalGrossWt += grossWt;
            totalStoneWt += stoneWt;
            totalNetWt += netWt;

            // Get image if available
            const fileInput = row.querySelector('.file-input');
            const imageData = fileInput?.dataset?.imageData;
            
            // Create row data
            const rowData = [
                (index + 1).toString(),
                row.querySelector('.itemName')?.value || '',
                row.querySelector('.category')?.value || '',
                row.querySelector('.purity')?.value || '',
                row.querySelector('.size')?.value || '',
                row.querySelector('.color')?.value || '',
                quantity.toFixed(3),
                grossWt.toFixed(3),
                stoneWt.toFixed(3),
                netWt.toFixed(3),
                row.querySelector('.remark')?.value || '',
                imageData ? 'Image' : 'No Image' // Placeholder for image column
            ];

            if (imageData) {
                rowData.imageData = imageData; // Add image data to the row for later processing
            }

            tableData.push(rowData);
        });

        // Add totals row
        tableData.push([
            'Total', '', '', '', '', '',
            totalQuantity.toFixed(3),
            totalGrossWt.toFixed(3),
            totalStoneWt.toFixed(3),
            totalNetWt.toFixed(3),
            '', ''
        ]);

        // Create table
        doc.autoTable({
            head: [[
                'Sl.No', 'Item Name', 'Category', 'Purity', 'Size', 'Color',
                'Quantity', 'Gross Wt', 'Stone Wt', 'Net Wt', 'Remark', 'Image'
            ]],
            body: tableData,
            startY: startY + lineHeight * 4,
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 15 },  // Sl.No
                1: { cellWidth: 30 },  // Item Name
                2: { cellWidth: 25 },  // Category
                3: { cellWidth: 20 },  // Purity
                4: { cellWidth: 20 },  // Size
                5: { cellWidth: 20 },  // Color
                6: { cellWidth: 20 },  // Quantity
                7: { cellWidth: 20 },  // Gross Wt
                8: { cellWidth: 20 },  // Stone Wt
                9: { cellWidth: 20 },  // Net Wt
                10: { cellWidth: 25 }, // Remark
                11: { cellWidth: 25 }  // Image
            },
            didDrawCell: function(data) {
                // Add image in the image column if available
                if (data.section === 'body' && data.column.index === 11 && tableData[data.row.index]?.imageData) {
                    const imageData = tableData[data.row.index].imageData;
                    try {
                        const rowHeight = imageDimension.height + 5; // Adjust row height for image
                        if (data.row.height < rowHeight) {
                            data.row.height = rowHeight; // Dynamically set row height
                        }
                        doc.addImage(
                            imageData,
                            'JPEG',
                            data.cell.x + (data.cell.width - imageDimension.width) / 2,
                            data.cell.y + (data.row.height - imageDimension.height) / 2,
                            imageDimension.width,
                            imageDimension.height
                        );
                    } catch (error) {
                        console.error('Error adding image to cell:', error);
                    }
                }
            }
        });

        // Add footer
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text("Order Approved By: ____________________", 20, finalY);
        doc.text("Authorised By: ____________________", 160, finalY);

        // Save the PDF
        doc.save("NeedhaGold_Order.pdf");

    } catch (err) {
        console.error("Error exporting to PDF:", err);
        alert("An error occurred while generating the PDF. Check console for details.");
    }
}



function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const cell = input.closest('td');
        
        reader.onload = function(e) {
            // Hide the upload label
            const uploadLabel = cell.querySelector('.file-upload-label');
            if (uploadLabel) {
                uploadLabel.style.display = 'none';
            }
            
            // Remove existing preview if any
            const existingPreview = cell.querySelector('.image-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            
            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.className = 'image-preview';
            
            // Create image element
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = function() {
                // Clear the input
                input.value = '';
                // Remove the preview
                previewContainer.remove();
                // Show the upload label again
                if (uploadLabel) {
                    uploadLabel.style.display = 'inline-block';
                }
                // Clear stored image data
                input.dataset.imageData = '';
            };
            
            // Add elements to preview container
            previewContainer.appendChild(img);
            previewContainer.appendChild(removeBtn);
            
            // Add preview to cell
            cell.appendChild(previewContainer);
            
            // Store image data for form submission
            input.dataset.imageData = e.target.result;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Add styles for the file upload and preview
const style = document.createElement('style');
style.textContent = `
    .file-upload-cell {
        position: relative;
        text-align: center;
    }
    
    .file-upload-label {
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        transition: all 0.3s;
    }
    
    .file-upload-label:hover {
        background-color: #e9ecef;
    }
    
    .file-input {
        display: none;
    }
    
    .image-preview {
        position: relative;
        margin-top: 10px;
        max-width: 100px;
        margin: 5px auto;
    }
    
    .preview-image {
        max-width: 100%;
        max-height: 100px;
        display: block;
        margin: 0 auto;
        border-radius: 4px;
    }
    
    .remove-image {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        padding: 0;
        font-size: 12px;
    }
    
    .remove-image:hover {
        background: #cc0000;
    }
    
    .fas {
        margin-right: 5px;
    }
`;
document.head.appendChild(style);