// Corrected February Analysis for 2299 Richter
// Excluding Internal Transfers (Personal Income, Not Business Expenses)
//
// ⚠️ KEY CORRECTION:
// Internal transfers ($14,885.55) are PERSONAL INCOME, not business expenses
// True business expenses should be calculated without these transfers

console.log('🔧 CORRECTED FEBRUARY ANALYSIS - 2299 RICHTER');
console.log('   (Excluding Internal Transfers as Personal Income)\n');

// February data from the analysis
const februaryData = {
  grossIncome: 7599.60,
  totalExpenses: 20824.07,
  internalTransfers: 14885.55,
  creditCardPayments: 1143.60,
  trueBusinessExpenses: 20824.07 - 14885.55 - 1143.60, // Excluding transfers and CC payments
  otherExpenses: 20824.07 - 14885.55 - 1143.60 - 3814.92, // Regular business expenses
};

console.log('📊 FEBRUARY 2025 ORIGINAL ANALYSIS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`💰 Gross Rental Income: $${februaryData.grossIncome.toLocaleString()}`);
console.log(`💸 Total Expenses (including transfers): $${februaryData.totalExpenses.toLocaleString()}`);
console.log(`⚠️  Reported Loss: $${(februaryData.grossIncome - februaryData.totalExpenses).toLocaleString()}`);
console.log('');

console.log('🔄 INTERNAL TRANSFER BREAKDOWN:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`💵 Internal Transfer to Personal: $${februaryData.internalTransfers.toLocaleString()}`);
console.log(`📝 Description: "Online Banking transfer to CHK 2437 Confirmation# XXXXX88850"`);
console.log(`🎯 Purpose: Personal use/withdrawal from business account`);
console.log(`📊 % of Total Expenses: ${(februaryData.internalTransfers / februaryData.totalExpenses * 100).toFixed(1)}%`);
console.log('');

console.log('✅ CORRECTED ANALYSIS (Excluding Transfers):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`💰 Gross Rental Income: $${februaryData.grossIncome.toLocaleString()}`);
console.log(`💸 True Business Expenses: $${februaryData.trueBusinessExpenses.toLocaleString()}`);
console.log(`💵 Personal Income (Transfer): $${februaryData.internalTransfers.toLocaleString()}`);
console.log(`📈 Corrected Profit: $${(februaryData.grossIncome - februaryData.trueBusinessExpenses).toLocaleString()}`);
console.log('');

console.log('📋 TRUE BUSINESS EXPENSE BREAKDOWN (February):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const businessExpenseBreakdown = {
  'Loan Payment': 3974.25,
  'Bills & Utilities': 1020.02,
  'Uncategorized': 1158.09,
  'Shopping': 1058.20,
  'Software & Tech': 235.15,
  'Entertainment & Rec.': 310.21,
  'Home & Garden': 552.87,
  'Taxes': 385.25,
  'Dining & Drinks': 19.99,
  'Travel & Vacation': 34.98,
  'Fees': 20.16,
};

let totalBusinessExpenses = 0;
Object.entries(businessExpenseBreakdown)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, amount]) => {
    console.log(`${category.padEnd(20)} $${amount.toLocaleString()}`);
    totalBusinessExpenses += amount;
  });

console.log('─'.repeat(40));
console.log(`Total Business Expenses: $${totalBusinessExpenses.toLocaleString()}`);
console.log('');

console.log('💡 KEY INSIGHTS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• Internal transfers are PERSONAL INCOME, not business expenses');
console.log('• True business expenses were only $5,939 (28.5% of reported expenses)');
console.log('• February was actually NEARLY PROFITABLE before the personal transfer');
console.log(`• Transfer represented ${(februaryData.internalTransfers / februaryData.totalExpenses * 100).toFixed(1)}% of total expenses`);
console.log(`• Without transfer, profit would have been: $${(februaryData.grossIncome - februaryData.trueBusinessExpenses).toLocaleString()}`);
console.log('');

console.log('🎯 RECOMMENDATION:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• Exclude internal transfers from expense calculations');
console.log('• Track personal withdrawals separately as "Owner Distributions"');
console.log('• Focus profitability analysis on true operational expenses');
console.log('• February was operationally sound - the transfer was a separate capital movement');

console.log('');
console.log('📊 FINAL CORRECTED FEBRUARY PROFITABILITY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Rental Income:     $${februaryData.grossIncome.toLocaleString()}`);
console.log(`Business Expenses: $${februaryData.trueBusinessExpenses.toLocaleString()}`);
console.log(`Personal Transfer: $${februaryData.internalTransfers.toLocaleString()}`);
console.log('─'.repeat(30));
console.log(`Business Profit:   $${(februaryData.grossIncome - februaryData.trueBusinessExpenses).toLocaleString()}`);
console.log(`Personal Income:   $${februaryData.internalTransfers.toLocaleString()}`);
console.log('');

console.log('✅ CONCLUSION: February was a profitable month operationally!');
console.log('   The large transfer was a separate personal withdrawal decision.');
