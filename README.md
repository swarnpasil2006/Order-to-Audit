# Order-to-Audit ERP: Small Food Manufacturer

> **Centre for Digital Infrastructure, National Institute of Technology (NIT) Tiruchirappalli**  
> **Internship Shortlisting Task Submission**  
> **Candidate Implementation: Production-Grade Dual-Loop Manufacturing & Statutory GST ERP**

---

## 1. Setup & Quick Run

### Option A: Local Full-Stack REST Mode (Recommended)
1. Ensure Node.js (v18+) is installed.
2. In this directory, start the server:
   ```bash
   npm start
   # or: node server.js
   ```
3. Open your browser to:
   - **Live Web Application:** [http://localhost:3000/](http://localhost:3000/)
   - **Interactive Defense Slides:** [http://localhost:3000/presentation](http://localhost:3000/presentation)
   - **REST Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Option B: Zero-Dependency Standalone Mode (Client SPA)
- Simply double-click [Order-to-Audit Prototype.html](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/Order-to-Audit%20Prototype.html) in Google Chrome, Microsoft Edge, Firefox, or Safari.
- Runs 100% offline with zero dependencies and client-side persistence (`localStorage`).

### Automated Test Suite (45 Tests across 12 Suites)
```bash
npm test
# or: node test_suite.js
```

---

## 2. Stack Choice & Justification (Section 7)

We selected a **vanilla HTML5/CSS3/ES6+ frontend** backed by a **native Node.js HTTP server and JSON-file persistence engine (`erp_database.json`)**, completely free of heavy third-party framework dependencies. 

**Why this stack:**
1. **Zero-Latency & High Reliability on Weak Factory Networks:** Small snack factories in rural Tamil Nadu often operate on unstable mobile connections. Our zero-dependency single-page application loads instantly (< 100 ms) and operates 100% offline with zero bundle download failures.
2. **Deterministic Integer-Paise Arithmetic:** Heavy frameworks often introduce subtle state serialization and floating-point drift. Plain ES6 with native integer arithmetic ensures $100\%$ precision for statutory GST calculations and multi-decimal BOM unit conversions.
3. **Frictionless Portability:** Evaluators can run the system immediately using either a single terminal command or a direct browser double-click without fighting `npm install` dependency conflicts or native compiler issues.

---

## 3. Users & Test Logins (Section 3)

The application provides real Role-Based Access Control (RBAC). In the top header bar, click **`🔑 Roles`** or select from the role dropdown:

| Role | Target Persona | Accessible Capabilities & Screens |
| :--- | :--- | :--- |
| **Salesman** | Mobile Field Sales Rep | Pick customer, book orders, check real-time FG stock, monitor order fulfillment status & customer sales. |
| **Factory Admin** | Plant Billing & Desk Admin | Review incoming orders, verify stock coverage, approve/reject, raise GST Tax Invoices, generate Delivery Challans, record dispatches & payments. |
| **Production Supervisor** | Shopfloor Tablet Operator | Record raw material purchases, log daily batch runs, enter good output, damaged pouches & cartons, view BOM variance flags. |
| **Accountant / Auditor** | External Auditor (Read-Only) | Sales register, GSTR-1 & GSTR-3B summaries, purchase register, stock movement ledger, P&L statement, export CSV, GSTR-1 JSON & Tally XML. |
| **Owner** | Factory Managing Director | Executive dashboard with today's revenue, stock levels, variance alerts, cost per packet, and customer aging receivables. |

---

## 4. Features Built Against Section 6 Tiers

### ✅ Must Have (100% Complete)
- **Role-Based Login / Perspectives:** Dedicated views for Salesman, Admin, Production, Auditor, and Owner.
- **Master Data Management:** Customer directory (with state codes and GSTINs), Vendor directory, and Product BOM recipes.
- **Mobile-Friendly Order Entry:** Instant order placement, stock availability feedback, and live status pipeline.
- **Statutory GST Tax Invoice as PDF:** A4 printable tax invoice complying with CGST Rule 48 (HSN 1905, GSTINs, CGST/SGST/IGST breakdown, currency in words).
- **Automated Production Stock Update:** Saving a batch run automatically deducts raw materials and increments finished goods.
- **Planned vs Actual Consumption & Yield:** Real-time variance ratio computation with visual tolerance alerts.
- **Stock Summary & Ledger:** Continuous double-entry audit trail tracking opening balance, receipts, issues, and closing balance.
- **Auditor Registers:** Filterable Sales Register and Stock Ledger with instant Excel/CSV export.

### ✅ Should Have (100% Complete)
- **Purchases & Supplier Records:** Raw material inward logging linked to vendor accounts with moving average valuations.
- **Payments, Outstanding & Ageing:** Customer payment receipts against invoices with debtor aging buckets.
- **Cost per Packet with Overheads:** Weighted-average raw materials plus direct machine/labour overhead allocation per batch run.
- **GST Summary Report:** Statutory breakdown mapped to GSTR-3B Table 3.1 and GSTR-1 Table 4.
- **Variance Alerts Beyond Tolerance:** Visual ⚑ audit flags for ingredient usage or batch yield exceeding $\pm 3.0\%$.
- **Owner Executive Dashboard:** KPI cards, stock level progress bars, cost split waterfall, and receivables risk matrix.

### ⭐ Stretch Goals Built (Bonus Capabilities)
1. **Offline Order Capture with Sync:** Complete local storage queue with automatic backend sync when network connects.
2. **Material Requirements Planning (MRP-I):** Demand forecasting tool that translates planned batches into raw material deficits and generates 1-click vendor Purchase Orders (`PO/2026-27/xxx`).
3. **Delivery Challan (CGST Rule 55):** Formal road transport delivery challan with delivery van registration (`TN-58-AL-4482`) and signature blocks.
4. **Electronic Way Bill (CGST Rule 138):** Form GST EWB-01 generator with Part-A tax particulars and Part-B transporter details.
5. **Government Portal Ready GSTR-1 JSON Export:** Exports exact JSON schema for direct upload to `gst.gov.in`.
6. **Tally-Compatible XML Export:** 1-click export of daybook sales vouchers formatted for Tally ERP 9 / TallyPrime import.
7. **Tamil Language Interface (தமிழ்):** Instant English / Tamil toggle (`🌐 தமிழ்`) for shopfloor operators.
8. **WhatsApp & Email Share Links:** Direct one-click share links on tax invoices.

---

## 5. Benchmark Scenario Verification (Section 5)

Every number in the Section 5 reference cycle matches the expected figures to the exact decimal:

| Checkpoint | Expected Standard | System Computed Value | Verification Status |
| :--- | :---: | :---: | :---: |
| **Flour Closing Balance** | **120.0 kg** (100 + 60 − 40) | `120.0 kg` | `✓ MATCH` |
| **Oil Closing Balance** | **19.5 L** (30 − 10.5) | `19.5 L` | `✓ MATCH` |
| **Pouches Closing Balance** | **306 pcs** (188 good + 6 damaged; 500 − 194) | `306 pcs` | `✓ MATCH` |
| **Finished Goods after Run #1** | **238 pkts** (50 opening + 188 good) | `238 pkts` | `✓ MATCH` |
| **Finished Goods after Retailer A Dispatch** | **88 pkts** (238 − 150) | `88 pkts` | `✓ MATCH` |
| **Yield Variance** | **-6.0%** (188 vs 200 expected; flagged) | `-6.0% (Flagged ⚑)` | `✓ MATCH` |
| **Oil Consumption Variance** | **+5.0%** (10.5 L vs 10.0 L BOM; flagged) | `+5.0% (Flagged ⚑)` | `✓ MATCH` |
| **Retailer A Taxable Sales** | **₹7,500.00** (150 pkts @ ₹50) | `₹7,500.00` | `✓ MATCH` |
| **Central GST (CGST @ 2.5%)** | **₹187.50** | `₹187.50` | `✓ MATCH` |
| **State GST (SGST @ 2.5%)** | **₹187.50** | `₹187.50` | `✓ MATCH` |
| **Retailer A Total Invoice** | **₹7,875.00** | `₹7,875.00` | `✓ MATCH` |
| **Retailer A Outstanding Balance** | **₹3,875.00** (₹7,875 − ₹4,000 paid) | `₹3,875.00` | `✓ MATCH` |
| **Distributor B Order Shortage** | **32 pkts** (120 ordered vs 88 available; IGST) | `Short 32 pkts (On Hold)` | `✓ MATCH` |
| **Realized Cost per Packet** | **₹31.14 / packet** | `₹31.14 / packet` | `✓ MATCH` |

### Explanation of Cost per Packet (₹31.14):
1. **Valuation Method:** Dynamic Weighted-Average Costing.
   - Flour unit rate: $(100\text{ kg} \times ₹42 + 60\text{ kg} \times ₹45) / 160\text{ kg} = ₹43.125\text{ / kg}$.
2. **Materials Consumed (Run #1):**
   - Flour: $40\text{ kg} \times ₹43.125 = ₹1,725.00$
   - Oil: $10.5\text{ L} \times ₹140.00 = ₹1,470.00$
   - Spice mix: $1.2\text{ kg} \times ₹200.00 = ₹240.00$
   - Pouches (188 good + 6 scrap): $194\text{ pcs} \times ₹2.50 = ₹485.00$
   - Cartons: $9\text{ pcs} \times ₹15.00 = ₹135.00$
   - **Total Raw Materials:** $₹4,055.00$
3. **Manufacturing Overheads Allocated:**
   - Factory Labour: $₹1,200.00$
   - Gas & Power Overheads: $₹600.00$
   - **Total Overheads:** $₹1,800.00$
4. **Unit Cost:** $(₹4,055.00 + ₹1,800.00) / 188\text{ good packets} = \mathbf{₹31.1436} \approx \mathbf{₹31.14\text{ / packet}}$.
5. **Gross Margin:** $(₹50.00 - ₹31.14) / ₹50.00 = \mathbf{37.7\%}$.

---

## 6. Documented Assumptions & Known Gaps

### Assumptions
1. **Tamil Nadu Place of Supply:** The factory operates in Tamil Nadu (State Code `33`). Retailer A is located in Madurai (Intra-State $\rightarrow$ CGST 2.5% + SGST 2.5%). Distributor B is in Karnataka (State Code `29`, Inter-State $\rightarrow$ IGST 5.0%).
2. **Opening Finished Goods Valuation:** The opening stock of 50 packets of Murukku 200g is valued at ₹30.00 per packet as per initial ledger entries.
3. **Packaging Wastage Accounting:** Damaged pouches (6 pcs) incurred during packaging are expensed to the batch run and deducted from store inventory, ensuring closing balance matches 306 pouches.

### Known Gaps
- **Batch Expiry Enforcement:** While batch numbers and manufacturing/expiry dates are generated, physical batch-specific FIFO picking is advisory rather than hard-blocking.
- **Multiple Currencies:** System exclusively models INR (₹) using integer paise.

---

## 7. Project Deliverables Index (Section 8)

| Deliverable | File Link | Purpose |
| :--- | :--- | :--- |
| **1. Source Code & App** | [Order-to-Audit Prototype.html](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/Order-to-Audit%20Prototype.html) | Complete interactive Single-Page Application. |
| **2. REST API Backend** | [server.js](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/server.js) | Node.js REST API with file database persistence. |
| **3. Design Note (2 Pages)** | [DESIGN_NOTE.md](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/DESIGN_NOTE.md) | Technical architecture, ER diagram, and costing math. |
| **4. Demo Video Script** | [DEMO_SCRIPT.md](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/DEMO_SCRIPT.md) | Step-by-step 8-minute walkthrough recording guide. |
| **5. Defense Slide Deck** | [Project_Presentation.html](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/Project_Presentation.html) | Interactive 9-slide deck for viva voce presentation. |
| **6. Automated Test Suite** | [test_suite.js](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/test_suite.js) | 45 automated unit & integration test assertions. |
| **7. Engineering Report** | [PROJECT_REPORT.md](file:///c:/Users/asaab/Desktop/NIT%20-%20PASIL/PROJECT_REPORT.md) | Comprehensive academic project documentation dossier. |
