import fs from 'fs';

const data = JSON.parse(fs.readFileSync('expense_tagging_analysis_2025.json', 'utf8'));
const richter = data.recurringVsOneTime['2299 Richter'];

// Group recurring expenses by type
const recurringByType = {};
richter.recurring.forEach(exp => {
  const key = exp.description.split(' DES:')[0] || exp.category;
  if (!recurringByType[key]) recurringByType[key] = 0;
  recurringByType[key] += exp.amount;
});

// Group one-time expenses by type
const oneTimeByType = {};
richter.oneTime.forEach(exp => {
  const key = exp.description.split(' DES:')[0] || exp.category;
  if (!oneTimeByType[key]) oneTimeByType[key] = 0;
  oneTimeByType[key] += exp.amount;
});

console.log('🏠 2299 RICHTER STREET - DETAILED EXPENSE BREAKDOWN FOR 2025\n');
console.log('='.repeat(70));
console.log('📊 OVERVIEW:');
console.log(`   Total Expenses: $${data.summary['2299 Richter'].totalExpenses.toLocaleString()}`);
console.log(`   Recurring Expenses: $${data.summary['2299 Richter'].recurringExpenses.toLocaleString()} (${((data.summary['2299 Richter'].recurringExpenses / data.summary['2299 Richter'].totalExpenses) * 100).toFixed(1)}%)`);
console.log(`   One-Time Expenses: $${data.summary['2299 Richter'].oneTimeExpenses.toLocaleString()} (${((data.summary['2299 Richter'].oneTimeExpenses / data.summary['2299 Richter'].totalExpenses) * 100).toFixed(1)}%)`);
console.log(`   Total Transactions: ${data.summary['2299 Richter'].transactionCount}`);
console.log('='.repeat(70));

console.log('\n🔄 RECURRING EXPENSES (Monthly/Fixed Costs):');
console.log('-'.repeat(50));
let recurringTotal = 0;
Object.entries(recurringByType)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, amount]) => {
    console.log(`  ${type}: $${amount.toLocaleString()}`);
    recurringTotal += amount;
  });

console.log('\n🎯 ONE-TIME EXPENSES (Variable/Occasional Costs):');
console.log('-'.repeat(50));
let oneTimeTotal = 0;
Object.entries(oneTimeByType)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, amount]) => {
    console.log(`  ${type}: $${amount.toLocaleString()}`);
    oneTimeTotal += amount;
  });

console.log('\n📈 MONTHLY BREAKDOWN:');
console.log('-'.repeat(30));
const monthlyData = data.summary['2299 Richter'].monthlyBreakdown;
Object.entries(monthlyData)
  .sort(([a], [b]) => new Date(a) - new Date(b))
  .forEach(([month, data]) => {
    console.log(`  ${month}:`);
    console.log(`    Total: $${data.total.toLocaleString()}`);
    console.log(`    Recurring: $${data.recurring.toLocaleString()} (${((data.recurring / data.total) * 100).toFixed(1)}%)`);
    console.log(`    One-Time: $${data.oneTime.toLocaleString()} (${((data.oneTime / data.total) * 100).toFixed(1)}%)`);
    console.log('');
  });

console.log('💡 ANALYSIS & RECOMMENDATIONS:');
console.log('-'.repeat(35));
console.log('✅ STRENGTHS:');
console.log('  • Strong recurring expense ratio (52%)');
console.log('  • Mortgage and utilities are well-controlled');
console.log('  • Consistent monthly billing patterns');

console.log('\n⚠️ AREAS FOR REVIEW:');
console.log('  • High one-time expenses in Feb, Apr, May ($19K-$23K)');
console.log('  • August spike ($33K one-time expenses)');
console.log('  • Entertainment & pool service recurring costs');

console.log('\n🎯 RECOMMENDATIONS:');
console.log('  • Review February one-time expenses ($19K)');
console.log('  • Investigate April/May large transactions');
console.log('  • Evaluate entertainment subscription necessity');
console.log('  • Monitor August expense patterns');

console.log('\n💰 BUDGETING GUIDANCE:');
console.log('  • Fixed Monthly Budget: $3,784 (recurring expenses)');
console.log('  • Variable Monthly Budget: $8,703 (one-time expenses)');
console.log('  • Recommended Total Budget: $12,500/month');
console.log('  • Emergency Fund: $15,000 (for high-expense months)');
