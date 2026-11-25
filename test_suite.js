/**
 * PASIL Foods - Enterprise Order-to-Audit ERP
 * Comprehensive Automated Test Suite
 * Run via: node test_suite.js
 */

const fs = require('fs');

// Load core ERP logic from Order-to-Audit Prototype.html
const html = fs.readFileSync('Order-to-Audit Prototype.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (!scriptMatch) {
  console.error('❌ Failed to extract script from Order-to-Audit Prototype.html');
  process.exit(1);
}

// Minimal headless browser environment
global.window = global;
global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => 'light' },
  getElementById: (id) => ({ id, innerHTML: '', appendChild: () => {}, setAttribute: () => {}, removeAttribute: () => {}, addEventListener: () => {} }),
  createElement: () => ({ innerHTML: '', appendChild: () => {}, setAttribute: () => {}, click: () => {}, remove: () => {} }),
  body: { appendChild: () => {} }
};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; }
};

// Export all functions to global scope
const exportBridge = `
;global.getS = () => S;
global.bal = bal;
global.avg = avg;
global.mv = mv;
global.avail = avail;
global.out = out;
global.cpp = cpp;
global.resetState = resetState;
global.purchaseItem = purchaseItem;
global.runProduction = runProduction;
global.addOverhead = addOverhead;
global.submitOrder = submitOrder;
global.approveOrder = approveOrder;
global.raiseInvoice = raiseInvoice;
global.dispatchInvoice = dispatchInvoice;
global.issueCreditNote = issueCreditNote;
global.recordPayment = recordPayment;
global.runBenchmark = runBenchmark;
global.numberToWords = numberToWords;
global.ROLE_PERMISSIONS = typeof ROLE_PERMISSIONS !== 'undefined' ? ROLE_PERMISSIONS : null;
global.setUserRole = typeof setUserRole !== 'undefined' ? setUserRole : null;
global.renderMRPCalculator = typeof renderMRPCalculator !== 'undefined' ? renderMRPCalculator : null;
`;

eval(scriptMatch[1] + '\n' + exportBridge);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${description}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${description} ${details ? '(' + details + ')' : ''}`);
  }
}

console.log('====================================================');
console.log('PASIL Foods ERP 2.0 - Automated Test Suite');
console.log('====================================================\n');

// Test Suite 1: State Initialization & Opening Balances
console.log('Suite 1: Initialization & Ledger Opening Balances');
resetState();
const s1 = getS();
assert('Initializes products map with mur (Murukku 200g)', !!s1.products.mur);
assert('Standard yield is 200 packets for Murukku 200g', s1.products.mur.standardYield === 200);
assert('Flour opening balance is 100 kg (100,000 g)', bal('flour') === 100000);
assert('Oil opening balance is 30 L (30,000 mL)', bal('oil') === 30000);
assert('Finished goods opening balance is 50 pkts (50,000 m)', bal('mur') === 50000);
assert('Flour weighted average unit cost is ₹42.00', Math.round(avg('flour') * 100) / 100 === 4200 / 1000);

// Test Suite 2: Purchases & Weighted Average Math
console.log('\nSuite 2: Purchases & Weighted-Average Valuation');
purchaseItem('flour', 60, 45, 'V1');
assert('Flour balance after purchase of 60 kg is 160 kg', bal('flour') === 160000);
// 100 kg @ ₹42 = ₹4,200; 60 kg @ ₹45 = ₹2,700; Total = ₹6,900 / 160 kg = ₹43.125/kg
const expectedUnitAvg = 690000 / 160000;
assert('Weighted average flour cost updates to ₹43.125/kg', Math.abs(avg('flour') - expectedUnitAvg) < 1e-4);

// Test Suite 3: Production Run & Recipe Variance
console.log('\nSuite 3: Production Run, BOM Variance & Overhead Costing');
const run1 = runProduction('mur', { flour: 40, oil: 10.5, spice: 1.2, pouch: 194, carton: 9 }, 188);
assert('Run output recorded as 188 good packets', run1.good === 188);
assert('Yield variance calculated as -6.0%', (run1.yv * 100).toFixed(1) === '-6.0');
const oilLine = run1.lines.find(l => l.it === 'oil');
assert('Oil issue actual variance is +5.0%', (oilLine.v > 0 ? '+' : '') + (oilLine.v * 100).toFixed(1) + '%' === '+5.0%');
assert('Oil variance flags audit alert (>3% tolerance)', oilLine.flag === true);
const spiceLine = run1.lines.find(l => l.it === 'spice');
assert('Spice issue variance is 0.0% (within tolerance)', spiceLine.flag === false);

addOverhead(run1.id, 'Labour', 1200);
addOverhead(run1.id, 'Power', 600);
assert('Overheads sum to ₹1,800.00', run1.oh === 180000);
assert('Cost per packet calculated as ₹31.14', Math.abs(cpp(run1) - 31.14) < 0.05);

// Test Suite 4: Sales Order Lifecycle, Reservation & Shortage
console.log('\nSuite 4: Sales Orders, Reservation & Shortage Protection');
// Prior to order, finished goods: 50 opening + 188 run = 238 pkts
assert('Available finished goods is 238 pkts', avail('mur') === 238);

submitOrder('A', 'Salesman A', 150, 'mur');
const o1 = getS().orders.find(o => o.id === 1);
assert('Order #1 submitted with 150 pkts', o1.q === 150 && o1.st === 'submitted');

const short1 = approveOrder(1);
assert('Order #1 approved without shortage', short1 === 0 && o1.st === 'approved');
assert('Available stock reduced to 88 pkts after reservation', avail('mur') === 88);

// Submit order exceeding remaining 88 packets
submitOrder('B', 'Salesman B', 120, 'mur');
const o2 = getS().orders.find(o => o.id === 2);
const short2 = approveOrder(2);
assert('Order #2 triggers shortage hold of 32 pkts', short2 === 32 && o2.st === 'on_hold');

// Test Suite 5: GST Calculation (Intra-state vs Inter-state)
console.log('\nSuite 5: Statutory GST Determination (Intra-State vs Inter-State)');
// Customer A is in Tamil Nadu (Intra-state => CGST 2.5% + SGST 2.5%)
const inv1 = raiseInvoice(1);
assert('Taxable value for 150 pkts @ ₹50 is ₹7,500.00', inv1.tx === 750000);
assert('Intra-state CGST (2.5%) is ₹187.50', inv1.cg === 18750);
assert('Intra-state SGST (2.5%) is ₹187.50', inv1.sg === 18750);
assert('Intra-state IGST is ₹0.00', inv1.ig === 0);
assert('Total invoice amount is ₹7,875.00', inv1.tot === 787500);

// Test Inter-state invoice
submitOrder('B', 'Salesman B', 50, 'mur'); // Customer B is Karnataka (State code 29)
approveOrder(3);
const inv2 = raiseInvoice(3);
assert('Inter-state IGST (5.0%) is ₹125.00', inv2.ig === 12500);
assert('Inter-state CGST is ₹0.00', inv2.cg === 0);
assert('Inter-state SGST is ₹0.00', inv2.sg === 0);

// Test Suite 6: Dispatch & Stock Movement
console.log('\nSuite 6: Physical Dispatch & Stock Ledger Movements');
const stockBeforeDispatch = Math.floor(bal('mur') / 1000);
dispatchInvoice(inv1.no);
const stockAfterDispatch = Math.floor(bal('mur') / 1000);
assert('Dispatching 150 pkts decreases finished goods by 150', stockBeforeDispatch - stockAfterDispatch === 150);
assert('Invoice marked as dispatched', inv1.disp === true);

// Test Suite 7: Customer Receivables & Payments
console.log('\nSuite 7: Customer Ledger, Outstanding & Payments');
assert('Customer A outstanding balance is ₹7,875.00', out('A') === 787500);
recordPayment('A', 4000, 'NEFT', 'TXN-9912');
assert('Customer A outstanding balance after ₹4,000 payment is ₹3,875.00', out('A') === 387500);

// Test Suite 8: Credit Note & Stock Restoration
console.log('\nSuite 8: Credit Note & Physical Inventory Reversal');
const stockBeforeCN = bal('mur');
issueCreditNote(inv1.no);
const stockAfterCN = bal('mur');
assert('Credit note restores 150 pkts (150,000 m) to stock ledger', stockAfterCN - stockBeforeCN === 150000);
assert('Invoice has Credit Note reference assigned', inv1.cn.startsWith('CN/'));

// Test Suite 9: Indian Currency Number-to-Words Converter
console.log('\nSuite 9: Currency Words Formatting (Indian Numbering System)');
assert('7875 formatted in words', numberToWords(7875) === 'Rupees Seven Thousand Eight Hundred Seventy Five');
assert('100000 formatted as One Lakh', numberToWords(100000) === 'Rupees One Lakh');
assert('10500250 formatted as One Crore Five Lakh Two Hundred Fifty', numberToWords(10500250) === 'Rupees One Crore Five Lakh Two Hundred Fifty');

// Test Suite 10: Full Section 5 Benchmark Execution
console.log('\nSuite 10: Section 5 Standard Benchmark Execution');
runBenchmark();
const bench = getS().benchResults;
assert('Benchmark execution produces 13 audit checks', bench && bench.length === 13);
const allPassed = bench.every(c => c.passed);
assert('All 13 Section 5 verification checks MATCH 100%', allPassed);

// Test Suite 11: Role-Based Access Control (RBAC) Permissions
console.log('\nSuite 11: Role-Based Access Control (RBAC) Permissions');
assert('Admin role has access to all 8 core tabs', ROLE_PERMISSIONS.admin.length === 8);
assert('Sales role restricted to Sales, Dashboard & Masters', ROLE_PERMISSIONS.sales.includes('sales') && !ROLE_PERMISSIONS.sales.includes('admin'));
assert('Production supervisor restricted to Prod, Stock & Masters', ROLE_PERMISSIONS.prod.includes('prod') && !ROLE_PERMISSIONS.prod.includes('sales'));
assert('Dispatch role has access to Invoicing & Stock', ROLE_PERMISSIONS.dispatch.includes('admin') && ROLE_PERMISSIONS.dispatch.includes('stock'));

// Test Suite 12: Material Requirements Planning (MRP) Engine
console.log('\nSuite 12: Material Requirements Planning (MRP-I) Engine');
const mrpHtml = renderMRPCalculator(400);
assert('MRP renders planned BOM table for 400 pkts', mrpHtml.includes('Flour') && mrpHtml.includes('Cooking Oil'));
assert('MRP calculates 2 standard batches for 400 pkts', mrpHtml.includes('80.00') && mrpHtml.includes('kg'));



console.log('\n====================================================');
console.log(`Test Results Summary: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED TESTS COMPLETED WITH 100% PASS RATE!\n');
}
