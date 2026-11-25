# DEMO SCRIPT & VIDEO RECORDING GUIDE (8 Minutes Max)

**Internship Submission Walkthrough:** Centre for Digital Infrastructure, NIT Tiruchirappalli  
**Project:** Order-to-Audit ERP (PASIL Foods Private Limited)  
**Video Target Duration:** 6 to 8 minutes  
**Format:** Screen recording with voiceover (Show both Mobile Salesman view & Desktop Admin view)

---

## 🎬 Pre-Recording Setup

1. Open your browser to: **`http://localhost:3000/`** (or open `Order-to-Audit Prototype.html`).
2. Press **Reset** in the top navigation bar to ensure fresh Section 5 opening balances.
3. Have two browser tabs or split screens ready:
   - **Tab 1 (Mobile view):** Toggle DevTools (F12) $\rightarrow$ Mobile Device Toolbar (iPhone / Pixel view) set to **Salesman Role**.
   - **Tab 2 (Desktop view):** Normal browser set to **Factory Admin & Billing Role**.

---

## ⏱ Minute-by-Minute Walkthrough Script

### 0:00 – 1:00 | Introduction & Architectural Dual-Loop Model
- **Voiceover:**
  > *"Hello! I am presenting the Order-to-Audit ERP system for small food manufacturers, built for the NIT Tiruchirappalli Centre for Digital Infrastructure internship task. Our client is PASIL Foods in Madurai, a traditional snack manufacturer. Today, I will demonstrate the complete Section 5 benchmark scenario where transactions entered once flow synchronously into inventory, recipe production costing, GST tax invoices, and monthly audit registers."*
- **Action on Screen:**
  - Show the Executive Dashboard.
  - Point to the live KPI cards: Revenue, Accounts Receivable, Finished Goods stock (50 packets opening), and the Recipe Cost split waterfall chart.

---

### 1:00 – 2:00 | Step 1: Raw Material Purchase Entry
- **Scenario:** Purchase of 60 kg flour at ₹45/kg from Sri Murugan Flour Mills.
- **Voiceover:**
  > *"Step 1: We receive 60 kg of flour at ₹45 per kg into factory stores. Notice that opening stock was 100 kg at ₹42. Our system computes weighted-average valuation dynamically: 100 kg at ₹42 plus 60 kg at ₹45 equals ₹6,900 across 160 kg, giving a new blended valuation rate of ₹43.125 per kg."*
- **Action on Screen:**
  - Navigate to **Production & BOM** tab.
  - In "Record Raw Material Purchase", select **Flour (Besan/Rice)**, Vendor **Sri Murugan Flour Mills**, Qty **60**, Rate **45**.
  - Click **Save Purchase Entry**.
  - Switch to **Stock & Ledger** tab: Show Flour balance is now **160 kg** valued at **₹6,900.00**.

---

### 2:00 – 3:30 | Steps 2 & 3: Production Run, BOM Variance & Scrap Tracking
- **Scenario:** 1 Batch Murukku 200 g. Issue 40 kg flour, 10.5 L oil (+0.5 L over BOM), 1.2 kg spices. Output: 188 good packets, 6 damaged pouches, 9 cartons used.
- **Voiceover:**
  > *"Steps 2 and 3: The shopfloor supervisor logs Production Run #1. The standard BOM expects 40 kg flour, 10 L oil, 1.2 kg spice mix, 200 pouches, and 10 cartons for an expected yield of 200 packets. In this actual run, 10.5 L of oil was issued—0.5 L over standard. Actual good output is 188 packets, with 6 pouches damaged in packaging, and 9 cartons used. Notice how the system flags the oil issue at +5.0% variance and the batch yield at -6.0% variance because they exceed our 3.0% audit tolerance. Total pouches deducted are 188 good plus 6 scrap = 194 pouches, leaving exactly 306 pouches in stock."*
- **Action on Screen:**
  - In **Production & BOM** tab:
    - Flour: `40`, Oil: `10.5`, Spices: `1.2`, Pouches: `194`, Cartons: `9`.
    - Good Packets: `188`.
  - Click **Record Batch Run**.
  - Show the variance table with **⚑ FLAGGED** badges on Oil (+5.0%) and Yield (-6.0%).
  - Show Finished Goods stock incremented from 50 to **238 packets** (50 + 188).

---

### 3:30 – 4:45 | Steps 4 & 5: Field Sales Order A & GST Tax Invoicing
- **Scenario:** Salesman A on mobile orders 150 packets for Retailer A (Tamil Nadu). Admin approves, generates GST invoice (CGST 2.5% + SGST 2.5%), and dispatches.
- **Voiceover:**
  > *"Steps 4 and 5: Salesman A in the field opens the mobile app. He selects Retailer A in Madurai and enters 150 packets. He submits the order directly to the factory with no WhatsApp message needed. On the admin desk, the incoming order shows that finished stock (238 pkts) comfortably covers the order. Admin approves it, which reserves the stock. Admin raises the GST Tax Invoice. Since Retailer A is in Tamil Nadu, intra-state tax applies: Taxable ₹7,500, CGST 2.5% ₹187.50, and SGST 2.5% ₹187.50, totaling ₹7,875.00. Admin then records physical dispatch, which reduces finished stock from 238 down to exactly 88 packets."*
- **Action on Screen:**
  - In **Sales & Orders** tab (Mobile view): Select **Retailer A**, Salesman **Salesman A**, Qty **150**. Click **Submit Order**.
  - In **Admin & Invoicing** tab: Show order approved, click **Raise Invoice**.
  - Click **🖨 Invoice**: Preview the statutory A4 GST Tax Invoice with HSN 1905, IRN, and Amount in Words (*Rupees Seven Thousand Eight Hundred Seventy Five Only*).
  - Click **📜 Challan** and **🚚 E-Way**: Show Delivery Challan (Rule 55) and Form GST EWB-01.
  - Click **✓ Dispatch**: Show status changed to Dispatched. Finished stock is now **88 packets**.

---

### 4:45 – 5:45 | Step 6: Order B Shortage & Inter-State GST Logic
- **Scenario:** Salesman B orders 120 packets for Distributor B (Karnataka). Show shortage handling.
- **Voiceover:**
  > *"Step 6: Salesman B books an order of 120 packets for Distributor B in Karnataka. But the factory only has 88 available packets! When admin attempts approval, the stock reservation engine isolates the deficit: the order is automatically placed ON HOLD with an exact shortage alert of 32 packets. The system also flags that because Distributor B is in Karnataka (State code 29), inter-state IGST at 5% will apply once fulfilled."*
- **Action on Screen:**
  - In **Sales & Orders**: Select **Distributor B (Karnataka)**, Qty **120**. Click **Submit Order**.
  - Click **Approve**: Point to the warning toast and badge: **On Hold (Short by 32 packets)**.

---

### 5:45 – 6:30 | Steps 7 & 8: Payment Collection & Batch Overhead Costing
- **Scenario:** Retailer A pays ₹4,000. Add Labour ₹1,200 and Gas/Power ₹600 to Run #1. Show unit cost per packet.
- **Voiceover:**
  > *"Steps 7 and 8: We record a payment receipt of ₹4,000 from Retailer A via NEFT. Retailer A's outstanding balance immediately updates from ₹7,875 down to ₹3,875. Next, we allocate direct manufacturing overheads to Run #1: Labour ₹1,200 and Gas/Power ₹600. Raw materials consumed were ₹4,055.00. Adding ₹1,800.00 overheads gives a total batch cost of ₹5,855.00. Divided across 188 good packets, our actual realized cost is exactly ₹31.14 per packet, yielding a healthy 37.7% gross operating margin against our ₹50 selling price."*
- **Action on Screen:**
  - In **Admin & Invoicing**: Record Payment from **Retailer A**, Amount **4000**. Show Outstanding **₹3,875.00**.
  - In **Production & BOM**: On Run #1, add Overheads: Labour ₹1200, Gas & Power ₹600.
  - Show the cost bar: **Materials ₹4,055 + Overheads ₹1,800 = ₹5,855 ➔ ₹31.14 / packet**.

---

### 6:30 – 7:30 | Step 9: Monthly Audit Reports, GSTR-1 & Tally XML Exports
- **Scenario:** Generate Section 4.6 reports (Sales Register, GSTR-1, GSTR-3B, P&L, Stock Ledger).
- **Voiceover:**
  > *"Step 9: At month-end, the accountant or auditor accesses the reports tab with zero re-keying:
  > 1. GSTR-3B summary matches outward taxable supplies and tax breakdown.
  > 2. GSTR-1 Table 4 registers B2B invoices with customer GSTINs.
  > 3. Manufacturing P&L shows Gross Revenue, COGS, and Gross Margin.
  > 4. We can export official GSTR-1 JSON for direct upload to gst.gov.in, download Tally-compatible XML daybook vouchers, or export registers to CSV/Excel."*
- **Action on Screen:**
  - Navigate to **Audit & GST Reports** tab.
  - Show the GSTR-3B table, Manufacturing P&L, Sales Register, and Purchase Register.
  - Click **📥 Export GSTR-1 JSON**: Show the downloaded government-ready JSON file.
  - Click **📤 Export Tally XML**: Show the exported Tally vouchers XML.

---

### 7:30 – 8:00 | Automated Benchmark Tab & Conclusion
- **Voiceover:**
  > *"Finally, we navigate to the Benchmark tab. Running our automated verification suite re-verifies all 13 checkpoints against the Section 5 reference specification with a 100% pass rate. Every number matches the problem statement exactly. Thank you!"*
- **Action on Screen:**
  - Click **✅ Benchmark Suite**: Point to all 13 checkmarks (**✓ MATCHED**).
  - Conclude the recording.
