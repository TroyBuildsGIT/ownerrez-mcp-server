import fs from 'fs';

const data = JSON.parse(fs.readFileSync('expense_tagging_analysis_2025.json', 'utf8'));
const brigadoon = data.recurringVsOneTime['2403 Brigadoon'];

// Group recurring expenses by type
const recurringByType = {};
brigadoon.recurring.forEach(exp => {
  const key = exp.description.split(' DES:')[0] || exp.category;
  if (!recurringByType[key]) recurringByType[key] = 0;
  recurringByType[key] += exp.amount;
});

// Group one-time expenses by type
const oneTimeByType = {};
brigadoon.oneTime.forEach(exp => {
  const key = exp.description.split(' DES:')[0] || exp.category;
  if (!oneTimeByType[key]) oneTimeByType[key] = 0;
  oneTimeByType[key] += exp.amount;
});

console.log('🏠 2403 BRIGADOON - EXPENSE BREAKDOWN FOR 2025\n');
console.log('='.repeat(60));
console.log('🔄 RECURRING EXPENSES (Monthly/Fixed Costs):');
console.log('-'.repeat(50));
let recurringTotal = 0;
Object.entries(recurringByType)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, amount]) => {
    console.log(`  ${type}: $${amount.toLocaleString()}`);
    recurringTotal += amount;
  });
console.log(`  TOTAL RECURRING: $${recurringTotal.toLocaleString()}`);

console.log('\n🎯 ONE-TIME EXPENSES (Variable/Occasional Costs):');
console.log('-'.repeat(50));
let oneTimeTotal = 0;
Object.entries(oneTimeByType)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, amount]) => {
    console.log(`  ${type}: $${amount.toLocaleString()}`);
    oneTimeTotal += amount;
  });
console.log(`  TOTAL ONE-TIME: $${oneTimeTotal.toLocaleString()}`);

console.log('\n📊 SUMMARY:');
console.log('-'.repeat(30));
console.log(`  Recurring Expenses: $${recurringTotal.toLocaleString()} (${((recurringTotal/(recurringTotal+oneTimeTotal))*100).toFixed(1)}%)`);
console.log(`  One-Time Expenses: $${oneTimeTotal.toLocaleString()} (${((oneTimeTotal/(recurringTotal+oneTimeTotal))*100).toFixed(1)}%)`);
console.log(`  Grand Total: $${(recurringTotal+oneTimeTotal).toLocaleString()}`);
