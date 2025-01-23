function addRow() {
    // Get the tbody that contains the order rows
    const tbody = document.getElementById("order-rows").parentNode;

    // Get the total row
    const totalRow = document.getElementById("total-row");

    // Calculate the next serial number based on the current rows
    const orderRows = tbody.querySelectorAll('.order-row'); // All rows with the class "order-row"
    const serialNumber = orderRows.length + 1;

    // Create a new row
    const row = document.createElement("tr");
    row.classList.add("order-row"); // Add a class to identify order rows

    // Add input fields in each cell of the new row
    row.innerHTML = `
        <td class="serial-number">${serialNumber}</td>
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

    // Insert the new row before the total row
    tbody.insertBefore(row, totalRow);

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

    // Update serial numbers dynamically for all rows
    updateSerialNumbers();
}

// Function to update serial numbers dynamically
function updateSerialNumbers() {
    const orderRows = document.querySelectorAll('.order-row');
    orderRows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-number');
        if (serialCell) {
            serialCell.textContent = index + 1; // Update serial number
        }
    });
    console.log("Serial numbers updated for all rows.");
}




function updateTotals() {
    // Calculate Total Weight and Balance
    const grossWeights = document.querySelectorAll(".grossWt");
    const advanceMetal = parseFloat(document.getElementById("advanceMetal")?.value) || 0;

    let totalWeight = 0;

    grossWeights.forEach((input) => {
        totalWeight += parseFloat(input.value) || 0;
    });

    document.getElementById("totalWt").value = totalWeight.toFixed(3);
    document.getElementById("balance").value = ( advanceMetal - totalWeight).toFixed(3);
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

// Generate the table dynamically from the rows
function generateTable() {
    try {
        const formData = {
            orderId: document.getElementById("orderId")?.value || null,
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || '22K',
            orderType: document.getElementById("orderType")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            totalWt: document.getElementById("totalWt")?.value || '',
            balance: document.getElementById("balance")?.value || '',
            items: []
        };

        const tbody = document.getElementById("order-rows").parentNode;
        const orderRows = tbody.querySelectorAll('.order-row');

        orderRows.forEach((row, index) => {
            const item = {
                serialNumber: index + 1,
                itemName: row.querySelector('.itemName')?.value || '',
                category: row.querySelector('.category')?.value || '',
                purity: row.querySelector('.purity')?.value || '',
                size: row.querySelector('.size')?.value || '',
                color: row.querySelector('.color')?.value || '',
                quantity: parseFloat(row.querySelector('.quantity')?.value) || 0,
                grossWt: parseFloat(row.querySelector('.grossWt')?.value) || 0,
                stoneWt: parseFloat(row.querySelector('.stoneWt')?.value) || 0,
                netWt: parseFloat(row.querySelector('.netWt')?.value) || 0,
                remark: row.querySelector('.remark')?.value || '',
                image: row.querySelector('.file-input')?.dataset.imageData || null
            };
            formData.items.push(item);
        });

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
                    <td>Party Name:</td>
                    <td colspan="2">${formData.partyName}</td>
                    <td>Purity: ${formData.purity}</td>
                    <td>Order ID:</td>
                    <td>${formData.orderId}</td>
                    <td>Order Type:</td>
                    <td colspan="3">${formData.orderType}</td>
                </tr>
                <tr>
                    <td colspan="6">Delivery Instructions:</td>
                    <td colspan="3">Delivery Date: ${formData.deliveryDate}</td>
                    <td colspan="3">Order By: ${formData.orderBy}</td>
                </tr>
                <tr>
                    <td>Advance Metal:</td>
                    <td colspan="4">${formData.advanceMetal}</td>
                    <td>Total Wt:</td>
                    <td>${formData.totalWt}</td>
                    <td>${formData.balance}</td>
                    <td colspan="2"></td>
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
                ${formData.items.map(item => `
                    <tr>
                        <td>${item.serialNumber}</td>
                        <td>${item.itemName}</td>
                        <td>${item.category}</td>
                        <td>${item.purity}</td>
                        <td>${item.size}</td>
                        <td>${item.color}</td>
                        <td>${item.quantity.toFixed(3)}</td>
                        <td>${item.grossWt.toFixed(3)}</td>
                        <td>${item.stoneWt.toFixed(3)}</td>
                        <td>${item.netWt.toFixed(3)}</td>
                        <td>${item.remark}</td>
                        <td>${item.image ? '<img src="' + item.image + '" style="max-width: 100px; max-height: 100px;">' : 'No Image'}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        document.getElementById("generatedTableContainer").innerHTML = tableHTML;
        console.log("Table generated successfully!");

    } catch (err) {
        console.error("Error generating table:", err);
        alert("An error occurred while generating the table.");
    }
}

// Submit the data to the backend
function submitData() {
    try {
        // Collect main order details
        const formData = {
            orderId: document.getElementById("orderId")?.value || null,
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || '22K',
            orderType: document.getElementById("orderType")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            advanceMetal: parseFloat(document.getElementById("advanceMetal")?.value) || 0,
            totalWt: parseFloat(document.getElementById("totalWt")?.value) || 0,
            balance: parseFloat(document.getElementById("balance")?.value) || 0,
            items: [] // Array to store order items
        };

        // Select all rows from the items table
        const orderRows = document.querySelectorAll('.order-row');
        if (orderRows.length === 0) {
            alert("No items found in the order.");
            return;
        }

        // Loop through rows and collect item details
        orderRows.forEach((row, index) => {
            const item = {
                serialNumber: index + 1,
                itemName: row.querySelector('.itemName')?.value || '',
                category: row.querySelector('.category')?.value || '',
                purity: row.querySelector('.purity')?.value || '',
                size: row.querySelector('.size')?.value || '',
                color: row.querySelector('.color')?.value || '',
                quantity: parseFloat(row.querySelector('.quantity')?.value) || 0,
                grossWt: parseFloat(row.querySelector('.grossWt')?.value) || 0,
                stoneWt: parseFloat(row.querySelector('.stoneWt')?.value) || 0,
                netWt: parseFloat(row.querySelector('.netWt')?.value) || 0,
                remark: row.querySelector('.remark')?.value || '',
                image: row.querySelector('.file-input')?.dataset?.imageData || null
            };

            formData.items.push(item); // Add each item to the items array
        });

        console.log("Submitting order data:", formData); // Debugging

        // Send data to the backend
        fetch("http://127.0.0.1:5000/add-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert("Order submitted successfully!");
                } else {
                    alert("Error submitting order: " + data.error);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while submitting the order.");
            });
    } catch (err) {
        console.error("Error in submitData:", err);
        alert("An error occurred. Please check the console for details.");
    }
}



/*

function submitForm() {
    try {
        // Collect main order data
        const formData = {
            orderId: document.getElementById("orderId")?.value || null,
            date: document.getElementById("date")?.value || '',
            partyName: document.getElementById("partyName")?.value || '',
            purity: document.getElementById("purity")?.value || '22K',
            orderType: document.getElementById("orderType")?.value || '',
            orderBy: document.getElementById("orderBy")?.value || '',
            deliveryDate: document.getElementById("deliveryDate")?.value || '',
            advanceMetal: document.getElementById("advanceMetal")?.value || '',
            totalWt: document.getElementById("totalWt")?.value || '',
            balance: document.getElementById("balance")?.value || '',
            items: []
        };

        // Collect order items from all rows
        const orderRows = document.querySelectorAll(".order-row");
        orderRows.forEach((row, index) => {
            const item = {
                serialNumber: index + 1,
                itemName: row.querySelector(".itemName")?.value || '',
                category: row.querySelector(".category")?.value || '',
                purity: row.querySelector(".purity")?.value || '',
                size: row.querySelector(".size")?.value || '',
                color: row.querySelector(".color")?.value || '',
                quantity: parseFloat(row.querySelector(".quantity")?.value) || 0,
                grossWt: parseFloat(row.querySelector(".grossWt")?.value) || 0,
                stoneWt: parseFloat(row.querySelector(".stoneWt")?.value) || 0,
                netWt: parseFloat(row.querySelector(".netWt")?.value) || 0,
                remark: row.querySelector(".remark")?.value || '',
                image: row.querySelector(".file-input")?.dataset.imageData || null
            };
            formData.items.push(item);
        });

        console.log("Submitting FormData:", formData); // Debugging

        // Generate a summary table
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
                    <td>Party Name:</td>
                    <td colspan="2">${formData.partyName}</td>
                    <td>Purity:</td>
                    <td>${formData.purity}</td>
                    <td>Order ID:</td>
                    <td>${formData.orderId}</td>
                    <td>Order Type:</td>
                    <td colspan="2">${formData.orderType}</td>
                </tr>
                <tr>
                    <td colspan="6">Delivery Instructions:</td>
                    <td colspan="3">Delivery Date: ${formData.deliveryDate}</td>
                    <td colspan="3">Order By: ${formData.orderBy}</td>
                </tr>
                <tr>
                    <td>Advance Metal:</td>
                    <td colspan="4">${formData.advanceMetal}</td>
                    <td>Total Wt:</td>
                    <td>${formData.totalWt}</td>
                    <td>Balance:</td>
                    <td colspan="3">${formData.balance}</td>
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
                ${formData.items.map(item => `
                    <tr>
                        <td>${item.serialNumber}</td>
                        <td>${item.itemName}</td>
                        <td>${item.category}</td>
                        <td>${item.purity}</td>
                        <td>${item.size}</td>
                        <td>${item.color}</td>
                        <td>${item.quantity.toFixed(3)}</td>
                        <td>${item.grossWt.toFixed(3)}</td>
                        <td>${item.stoneWt.toFixed(3)}</td>
                        <td>${item.netWt.toFixed(3)}</td>
                        <td>${item.remark}</td>
                        <td>${item.image ? '<img src="' + item.image + '" style="max-width: 100px; max-height: 100px;">' : 'No Image'}</td>
                    </tr>`).join('')}
            </table>
        `;
        document.getElementById("generatedTableContainer").innerHTML = tableHTML;

        // Send the collected data to the backend
        fetch("http://127.0.0.1:5000/add-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert("Order submitted successfully!");
                } else {
                    alert("Error submitting order: " + data.error);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while submitting the order.");
            });
    } catch (err) {
        console.error("Error in submitForm:", err);
        alert("An error occurred. Check console for details.");
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
*/

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
        doc.text(`Total Wt: ${formData.totalWt}`, 80, startY + lineHeight * 2);
        doc.text(`Balance: ${formData.balance}`, 150, startY + lineHeight * 2);

        // Get order details
        const tbody = document.getElementById("order-rows").parentNode;
        const startRow = document.getElementById("order-rows");
        const orderRows = document.querySelectorAll('.order-row'); // Select only rows with "order-row" class


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
