// Expense Tagging Analysis - Recurring vs One-Time Expenses
// This script analyzes all property expenses and tags them as recurring or one-time

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expenseFiles = [
  '2299 richter credit and acocount expenses 2025.csv',
  '10222 66th expenses 2025.csv',
  '2403 brigadoon expenses 2025.csv'
];

const properties = {
  '2299 richter credit and acocount expenses 2025.csv': '2299 Richter',
  '10222 66th expenses 2025.csv': '10222 66th',
  '2403 brigadoon expenses 2025.csv': '2403 Brigadoon'
};

// Tagging rules for recurring vs one-time expenses
const RECURRING_KEYWORDS = [
  // Fixed monthly payments
  'mortgage', 'mtg pymt', 'loan payment', 'home mtg',

  // Utilities
  'duke energy', 'wow!', 'p c utilities', 'clearwater city', 'spectrum',
  'bills & utilities', 'utility', 'electric', 'internet', 'water',

  // HOA and association fees
  'brigadoon of cle', 'association dues', 'hoa',

  // Subscriptions and services
  'netflix', 'youtube tv', 'business adv fundamentals', 'monthly fee',

  // Regular maintenance
  'anti-pesto', 'pest control', 'lawn care' // if recurring
];

const ONE_TIME_KEYWORDS = [
  // Repairs and maintenance
  'repair', 'cleaning', 'flooring', 'fence', 'ac repair', 'storm repair',
  'home improvement', 'renovation', 'maintenance',

  // Supplies and materials
  'home depot', 'lowe\'s', 'bjs wholesale', 'amazon', 'supplies',
  'materials', 'furnishing', 'decor',

  // One-off payments
  'deposit release', 'returned tenant deposit', 'transport services',
  'pool service', 'dining', 'entertainment' // if not recurring
];

function categorizeExpense(description, category, amount) {
  const desc = description.toLowerCase();
  const cat = category.toLowerCase();

  // Check for recurring keywords
  for (const keyword of RECURRING_KEYWORDS) {
    if (desc.includes(keyword) || cat.includes(keyword)) {
      return 'RECURRING';
    }
  }

  // Check for one-time keywords
  for (const keyword of ONE_TIME_KEYWORDS) {
    if (desc.includes(keyword) || cat.includes(keyword)) {
      return 'ONE_TIME';
    }
  }

  // Amount-based heuristics
  if (amount > 1000) {
    // Large amounts are likely one-time
    return 'ONE_TIME';
  }

  // Default to one-time if unclear
  return 'ONE_TIME';
}

function analyzeExpenses() {
  const results = {
    summary: {},
    monthlyBreakdown: {},
    recurringVsOneTime: {}
  };

  expenseFiles.forEach(fileName => {
    const filePath = path.join(__dirname, 'data/raw/rocket_money/2025', fileName);
    const propertyName = properties[fileName];

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }

    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');

    results.summary[propertyName] = {
      totalExpenses: 0,
      recurringExpenses: 0,
      oneTimeExpenses: 0,
      transactionCount: 0,
      monthlyBreakdown: {}
    };

    results.recurringVsOneTime[propertyName] = {
      recurring: [],
      oneTime: []
    };

    // Process each transaction
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < 10) continue;

      const date = values[0];
      const amount = parseFloat(values[8]) || 0;
      const description = values[9];
      const category = values[10];

      if (!date || isNaN(amount) || amount === 0) continue;

      const monthYear = getMonthYear(date);
      const expenseType = categorizeExpense(description, category, amount);

      // Initialize monthly breakdown
      if (!results.summary[propertyName].monthlyBreakdown[monthYear]) {
        results.summary[propertyName].monthlyBreakdown[monthYear] = {
          total: 0,
          recurring: 0,
          oneTime: 0
        };
      }

      // Update totals
      results.summary[propertyName].totalExpenses += Math.abs(amount);
      results.summary[propertyName].transactionCount++;

      if (expenseType === 'RECURRING') {
        results.summary[propertyName].recurringExpenses += Math.abs(amount);
        results.summary[propertyName].monthlyBreakdown[monthYear].recurring += Math.abs(amount);
        results.recurringVsOneTime[propertyName].recurring.push({
          date, amount: Math.abs(amount), description, category
        });
      } else {
        results.summary[propertyName].oneTimeExpenses += Math.abs(amount);
        results.summary[propertyName].monthlyBreakdown[monthYear].oneTime += Math.abs(amount);
        results.recurringVsOneTime[propertyName].oneTime.push({
          date, amount: Math.abs(amount), description, category
        });
      }

      results.summary[propertyName].monthlyBreakdown[monthYear].total += Math.abs(amount);
    }
  });

  return results;
}

function getMonthYear(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('🏷️  EXPENSE TAGGING ANALYSIS - RECURRING vs ONE-TIME');
  console.log('='.repeat(80));

  Object.keys(results.summary).forEach(propertyName => {
    const prop = results.summary[propertyName];

    console.log(`\n🏠 ${propertyName}`);
    console.log('-'.repeat(50));
    console.log(`📊 Total Expenses: $${prop.totalExpenses.toLocaleString()}`);
    console.log(`🔄 Recurring Expenses: $${prop.recurringExpenses.toLocaleString()} (${((prop.recurringExpenses / prop.totalExpenses) * 100).toFixed(1)}%)`);
    console.log(`🎯 One-Time Expenses: $${prop.oneTimeExpenses.toLocaleString()} (${((prop.oneTimeExpenses / prop.totalExpenses) * 100).toFixed(1)}%)`);
    console.log(`📈 Transactions: ${prop.transactionCount}`);

    console.log('\n📅 Monthly Breakdown:');
    Object.keys(prop.monthlyBreakdown).forEach(month => {
      const monthData = prop.monthlyBreakdown[month];
      console.log(`  ${month}:`);
      console.log(`    Total: $${monthData.total.toLocaleString()}`);
      console.log(`    Recurring: $${monthData.recurring.toLocaleString()} (${((monthData.recurring / monthData.total) * 100).toFixed(1)}%)`);
      console.log(`    One-Time: $${monthData.oneTime.toLocaleString()} (${((monthData.oneTime / monthData.total) * 100).toFixed(1)}%)`);
    });

    // Show top recurring expenses
    console.log('\n🔄 Top Recurring Expenses:');
    const recurringExpenses = results.recurringVsOneTime[propertyName].recurring;
    const recurringByType = {};

    recurringExpenses.forEach(exp => {
      const key = exp.description.split(' DES:')[0] || exp.category;
      if (!recurringByType[key]) {
        recurringByType[key] = 0;
      }
      recurringByType[key] += exp.amount;
    });

    Object.entries(recurringByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([type, amount]) => {
        console.log(`  ${type}: $${amount.toLocaleString()}`);
      });

    // Show top one-time expenses
    console.log('\n🎯 Top One-Time Expenses:');
    const oneTimeExpenses = results.recurringVsOneTime[propertyName].oneTime;
    const oneTimeByType = {};

    oneTimeExpenses.forEach(exp => {
      const key = exp.description.split(' DES:')[0] || exp.category;
      if (!oneTimeByType[key]) {
        oneTimeByType[key] = 0;
      }
      oneTimeByType[key] += exp.amount;
    });

    Object.entries(oneTimeByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([type, amount]) => {
        console.log(`  ${type}: $${amount.toLocaleString()}`);
      });
  });

  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(80));

  Object.keys(results.summary).forEach(propertyName => {
    const prop = results.summary[propertyName];
    const recurringRatio = prop.recurringExpenses / prop.totalExpenses;

    console.log(`\n🏠 ${propertyName}:`);
    if (recurringRatio > 0.7) {
      console.log(`✅ Strong recurring expense ratio (${(recurringRatio * 100).toFixed(1)}%) - Good for budgeting`);
    } else if (recurringRatio > 0.5) {
      console.log(`⚠️ Moderate recurring expense ratio (${(recurringRatio * 100).toFixed(1)}%) - Monitor one-time costs`);
    } else {
      console.log(`🚨 Low recurring expense ratio (${(recurringRatio * 100).toFixed(1)}%) - High one-time expenses`);
    }
  });
}

// Run the analysis
const results = analyzeExpenses();
generateReport(results);

// Save detailed results
fs.writeFileSync(
  path.join(__dirname, 'expense_tagging_analysis_2025.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n💾 Detailed results saved to: expense_tagging_analysis_2025.json');
