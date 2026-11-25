# NIT Tiruchirappalli: 30-Minute Interview & Viva Voce Preparation Guide

**Centre for Digital Infrastructure, NIT Tiruchirappalli**  
**Role:** Order-to-Audit System for Small Food Manufacturers  
**Candidate Preparation Dossier**

---

## 1. Interview Structure & What Evaluators Look For

Section 9 of the problem statement defines the 30-minute interview:
> *"Shortlisted applicants will have a 30-minute interview: a live walkthrough, questions on their design choices, and a small change made on the spot (for example, 'add a second pack size of 500 g sharing the same BOM')."*

The evaluation panel is assessing:
1. **Understanding of real-world business physics**: Do you understand why bulk commodities cannot use discrete FIFO? Why integer arithmetic is necessary for GST?
2. **Code Ownership**: Can you navigate and modify the code live without relying on AI assistance?
3. **Traceability**: Can you show where every stock number originates?

---

## 2. Walkthrough Strategy (First 10 Minutes)

1. **State the core problem in 1 sentence:**
   > *"Small food manufacturers in Tamil Nadu suffer from unmonitored recipe variances and unlinked warehouse stockouts; our system unifies the sales loop and production loop at finished-goods inventory using an integer-paise continuous movement ledger."*
2. **Open the live application at `http://localhost:3000/`**:
   - Show the **Dashboard**: Highlight Revenue, AR, and the per-packet Cost Waterfall (₹21.57 materials + ₹9.57 overheads = ₹31.14 / pkt).
   - Switch to **Role Login (`🔑 Roles`)**: Demonstrate switching between Mobile Salesman, Floor Supervisor, and Desk Admin.
3. **Execute Section 5 Benchmark**:
   - Click **▶ Run Benchmark**.
   - Show the **13/13 Checks Passing**: Point out Oil variance (+5.0% ⚑), Batch Yield variance (-6.0% ⚑), and Retailer A tax breakdown (CGST ₹187.50 + SGST ₹187.50 = ₹7,875.00).

---

## 3. Live Coding Challenge (Section 9 Example)

### The Prompt:
> *"Add a second pack size of 500 g sharing the same recipe BOM."*

### How to solve it live during the interview:

#### Approach 1: Via the Master UI (No code restart needed)
1. Go to the **👥 Masters Directory** tab in the app.
2. Click **`+ Add New Product`**.
3. Enter:
   - **Product ID:** `mur500`
   - **Description:** `Murukku 500 g Family Pack`
   - **HSN:** `1905`
   - **Selling Price:** `120` (or ₹120/pkt)
   - **GST Rate:** `5%`
   - **Standard Yield:** `80` (Since $40\text{ kg} / 0.5\text{ kg} = 80\text{ packets}$)
   - **Recipe BOM:** Flour `40` kg, Oil `10` L, Spices `1.2` kg.
4. Click **Save Product**.
5. Immediately place an order for Murukku 500 g on the Salesman screen!

#### Approach 2: Via Code (`DEFAULT_PRODUCTS` in `Order-to-Audit Prototype.html` & `server.js`)
Add the following product object:
```javascript
mur500: {
  id: 'mur500',
  name: 'Murukku 500 g Pack',
  hsn: '1905',
  unit: 'packets',
  price: 12000, // paise (₹120.00)
  gstRate: 5,   // 5%
  standardYield: 80, // 40 kg flour yields 80 packets of 500 g
  bom: { flour: 40, oil: 10, spice: 1.2, pouch: 80, carton: 4 } // 20 pkts/carton -> 4 cartons
}
```

**Key Mathematical Justification to give the panel:**
> *"A 500 g packet requires 2.5× the raw dough of a 200 g packet. Therefore, a standard 40 kg flour batch that yields 200 packets of 200 g will yield exactly 80 packets of 500 g ($200 / 2.5 = 80$). Packaging items scale accordingly: 80 printed 500 g pouches and 4 corrugated shipping cartons (at 20 packets per carton)."*

---

## 4. Top Technical Questions & Model Answers

### Q1: "Why did you choose Weighted-Average Valuation over FIFO for raw materials?"
**Model Answer:**
> *"In small-scale snack manufacturing, raw flour and cooking oil are bulk commodities. When a new lot of 60 kg flour arrives, it is physically dumped into the existing factory storage bin containing the 100 kg opening balance. Tagging and extracting discrete older grains (FIFO) is physically impossible for loose dry flour silos and bulk oil tanks. Weighted-average reflects the true blended economic cost of materials consumed without artificial step-jumps in batch cost accounting."*

### Q2: "How do you guarantee that stock is never negative and numbers never drift?"
**Model Answer:**
> *"Two architectural safeguards: First, all monetary values are stored as integer paise ($₹1.00 = 100\text{ paise}$) and all physical units as integers ($1\text{ kg} = 1,000,000\text{ mg}$), eliminating IEEE-754 floating-point rounding creep. Second, finished goods availability is strictly evaluated before order approval: $\text{Available} = \text{Ledger Sum} - \text{Approved Unfulfilled Reservations}$. If an order exceeds available stock, it is placed ON HOLD with an exact shortage alert before an invoice can ever be raised."*

### Q3: "What happens when a customer returns goods or an invoice is cancelled?"
**Model Answer:**
> *"Under Indian GST statutory law and auditing principles, posted tax invoices must never be deleted from the database. Our system issues a formal Credit Note (Rule 54) linked to the original invoice number (`CN/2026-27/xxxx`). This immediately creates a reverse compensating transaction in the stock movement ledger, returning the physical finished goods into stock while zeroing out the customer receivable and tax liability in GSTR-1 Table 8."*

### Q4: "How does your system map outward supplies to GSTR-1 and GSTR-3B?"
**Model Answer:**
> *"Our system dynamically determines Place of Supply based on the customer's GST state code (Tamil Nadu = 33). For intra-state transactions, it computes CGST 2.5% and SGST 2.5%; for inter-state (e.g. Karnataka = 29), it computes IGST 5.0%. For GSTR-3B Table 3.1, it aggregates total outward taxable turnover and net tax liabilities. For GSTR-1, it generates the exact B2B JSON schema grouped by recipient GSTIN (`ctin`), allowing direct batch upload to the government GST offline utility without manual re-keying."*

### Q5: "Why did you build this with native vanilla web standards instead of React/Next.js/Electron?"
**Model Answer:**
> *"Three reasons: 1) Zero-dependency reliability on weak rural networks: it loads in under 50 milliseconds with zero bundle download failures; 2) Deterministic correctness: no third-party state synchronization drift; 3) Frictionless evaluation: any evaluator can run it locally with zero build steps either via `npm start`, Docker, or by opening the HTML file directly."*

---

## 5. 30-Minute Interview Checklist

- [ ] Ensure `node server.js` is running on port 3000.
- [ ] Test the **Reset** button to verify clean state.
- [ ] Open the **Presentation Deck** at `/presentation` as a visual backup.
- [ ] Keep DevTools Mobile Toggle ready to show the Salesman mobile view.
- [ ] Remember the unit cost figure: **₹31.14 per packet** (₹4,055 materials + ₹1,800 overheads over 188 packets = 37.7% margin).
