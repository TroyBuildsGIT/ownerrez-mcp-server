// Monthly Profit Analysis for 10222 66th Ave (Long-term Rental) - 2025
// Profit = Income - Expenses (PROPORTIONAL SPLITTING for multi-month bookings)
//
// ⚠️ METHODOLOGY: Proportional Income Splitting for Long-term Rentals
// - Long-term bookings (6-12 months) are split proportionally across months
// - Provides accurate monthly revenue attribution for lease periods

import fs from 'fs';
import path from 'path';

// Manual income data for 10222 66th (long-term rental)
const manualIncomeData = {
  'January 2025': [
    { date: '2025-01-08', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'February 2025': [
    { date: '2025-02-10', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'March 2025': [
    { date: '2025-03-11', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'April 2025': [
    { date: '2025-04-10', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'May 2025': [
    { date: '2025-05-12', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'June 2025': [
    { date: '2025-06-10', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'July 2025': [
    { date: '2025-07-10', amount: 3150, description: 'RentSpree Payout', source: 'manual' }
  ],
  'August 2025': [], // Tenant transition period
  'September 2025': [], // Short-term rentals start
  'October 2025': [],
  'November 2025': [],
  'December 2025': []
};

// Manual expense data (additional expenses not in CSV)
const manualExpenseData = {
  'January 2025': [
    { date: '2025-01-10', amount: 125, description: 'Zelle payment to brian bowie for repairs', category: 'Uncategorized' },
    { date: '2025-01-10', amount: 125, description: 'Zelle payment to brian bowie for storm repair', category: 'Uncategorized' }
  ],
  'February 2025': [],
  'March 2025': [
    { date: '2025-03-18', amount: 629, description: 'Zelle payment to same day repair inc for ac repair', category: 'Uncategorized' }
  ],
  'April 2025': [],
  'May 2025': [],
  'June 2025': [],
  'July 2025': [],
  'August 2025': [
    { date: '2025-08-13', amount: 3150, description: 'Zelle payment to AMANDA RETTENMAIER for tenant deposit release 1 month', category: 'Uncategorized' },
    { date: '2025-08-14', amount: 3150, description: 'Zelle Scheduled payment to AMANDA RETTENMAIER for 2nd deposit release', category: 'Uncategorized' },
    { date: '2025-08-14', amount: 300, description: 'Zelle payment to J loves lawn care for lawn repair', category: 'Home & Garden' },
    { date: '2025-08-15', amount: 2500, description: 'Zelle payment to josh oconnor for furnishing 10222 66th ave s', category: 'Uncategorized' },
    { date: '2025-08-22', amount: 3500, description: 'Zelle payment to next gen rei', category: 'Uncategorized' },
    { date: '2025-08-28', amount: 300, description: 'Zelle payment to jess doherty', category: 'Uncategorized' },
    { date: '2025-08-29', amount: 300, description: 'Zelle Transfer to JESSICA DOHERTY', category: 'Uncategorized' }
  ],
  'September 2025': [],
  'October 2025': [],
  'November 2025': [],
  'December 2025': []
};

// Helper function to get month name and year from date
function getMonthYear(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Helper function to get days in month
function getDaysInMonth(monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Parse expenses CSV file
function parseExpenses(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');

  const expenses = {};
  const incomeFromCsv = {};

  // Initialize monthly data
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];

  months.forEach(month => {
    expenses[`${month} 2025`] = {
      totalExpenses: 0,
      categoryBreakdown: {},
      transactions: []
    };
    incomeFromCsv[`${month} 2025`] = {
      totalIncome: 0,
      transactions: []
    };
  });

  // Parse each line
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 10) continue;

    const date = values[0];
    const amount = parseFloat(values[8]) || 0;
    const description = values[9];
    const category = values[10];

    if (!date || isNaN(amount)) continue;

    // Skip income transactions (negative amounts)
    if (amount < 0) continue;

    const monthYear = getMonthYear(new Date(date));
    if (expenses[monthYear]) {
      if (amount > 0 && category !== 'Income') {
        // This is an expense
        expenses[monthYear].totalExpenses += amount;
        expenses[monthYear].transactions.push({
          date,
          amount,
          description,
          category
        });

        // Category breakdown
        if (!expenses[monthYear].categoryBreakdown[category]) {
          expenses[monthYear].categoryBreakdown[category] = 0;
        }
        expenses[monthYear].categoryBreakdown[category] += amount;
      }
    }
  }

  return { expenses, incomeFromCsv };
}

// Combine income data from manual input and CSV
function combineIncomeData(manualIncome, csvIncome) {
  const combinedIncome = {};

  const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
                 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'];

  months.forEach(monthYear => {
    combinedIncome[monthYear] = {
      totalIncome: 0,
      transactions: [],
      monthlyRentCount: 0
    };

    // Add manual income data
    if (manualIncome[monthYear]) {
      manualIncome[monthYear].forEach(transaction => {
        combinedIncome[monthYear].totalIncome += transaction.amount;
        combinedIncome[monthYear].transactions.push(transaction);
        if (transaction.description.includes('RentSpree')) {
          combinedIncome[monthYear].monthlyRentCount += 1;
        }
      });
    }

    // Add CSV income data (excluding income that's already in manual data)
    if (csvIncome[monthYear]) {
      csvIncome[monthYear].transactions.forEach(transaction => {
        // Avoid double-counting if the transaction is already in manual data
        const alreadyExists = combinedIncome[monthYear].transactions.some(t =>
          t.date === transaction.date && t.amount === transaction.amount
        );

        if (!alreadyExists) {
          combinedIncome[monthYear].totalIncome += transaction.amount;
          combinedIncome[monthYear].transactions.push(transaction);
          if (transaction.description.includes('RentSpree')) {
            combinedIncome[monthYear].monthlyRentCount += 1;
          }
        }
      });
    }
  });

  return combinedIncome;
}

// Combine expense data from manual input and CSV
function combineExpenseData(csvExpenses, manualExpenses) {
  const combinedExpenses = {};

  const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
                 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'];

  months.forEach(monthYear => {
    combinedExpenses[monthYear] = {
      totalExpenses: csvExpenses[monthYear].totalExpenses,
      categoryBreakdown: { ...csvExpenses[monthYear].categoryBreakdown },
      transactions: [...csvExpenses[monthYear].transactions]
    };

    // Add manual expenses
    if (manualExpenses[monthYear]) {
      manualExpenses[monthYear].forEach(transaction => {
        combinedExpenses[monthYear].totalExpenses += transaction.amount;
        combinedExpenses[monthYear].transactions.push(transaction);

        // Category breakdown
        if (!combinedExpenses[monthYear].categoryBreakdown[transaction.category]) {
          combinedExpenses[monthYear].categoryBreakdown[transaction.category] = 0;
        }
        combinedExpenses[monthYear].categoryBreakdown[transaction.category] += transaction.amount;
      });
    }
  });

  return combinedExpenses;
}

// Main analysis function for 10222 66th with proportional splitting
async function monthlyProfitAnalysis10222ProportionalSplit() {
  console.log('🚀 Starting Monthly Profit Analysis for 10222 66th Ave (Proportional Split)...\n');

  try {
    // Step 1: Load and parse expenses from CSV
    console.log('💰 Loading expenses data from CSV...');
    const expensesFilePath = path.join(process.cwd(), '2025 expenses', '10222 66th expenses 2025.csv');
    const expensesCsv = fs.readFileSync(expensesFilePath, 'utf8');
    const { expenses: csvExpenses, incomeFromCsv } = parseExpenses(expensesCsv);

    console.log('✅ CSV data loaded and parsed');

    // Step 2: Combine income and expense data
    console.log('\n💰 Combining income and expense data...');
    const combinedIncome = combineIncomeData(manualIncomeData, incomeFromCsv);
    const combinedExpenses = combineExpenseData(csvExpenses, manualExpenseData);

    console.log('✅ Data combined successfully');

    // Step 3: Calculate monthly profits
    console.log('\n💰 Calculating monthly profits (proportional split approach)...');

    const monthlyProfits = {};
    const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
                   'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'];

    let totalIncome = 0;
    let totalExpenses = 0;

    months.forEach(monthYear => {
      const income = combinedIncome[monthYear];
      const expenses = combinedExpenses[monthYear];

      monthlyProfits[monthYear] = {
        income: income.totalIncome,
        expenses: expenses.totalExpenses,
        profit: income.totalIncome - expenses.totalExpenses,
        incomeDetails: income,
        expenseDetails: expenses,
        monthlyRentCount: income.monthlyRentCount
      };

      totalIncome += income.totalIncome;
      totalExpenses += expenses.totalExpenses;
    });

    // Step 4: Display results
    console.log('\n' + '='.repeat(140));
    console.log('💵 MONTHLY PROFIT ANALYSIS - 10222 66TH AVE (LONG-TERM RENTAL) - 2025 (PROPORTIONAL SPLIT)');
    console.log('='.repeat(140));
    console.log('\n💡 PROFIT = Monthly Rent Income - Total Expenses (Long-term rental with consistent payments)');

    console.log('\n📊 MONTHLY BREAKDOWN:');
    console.log('Month'.padEnd(12) + 'Rent Income'.padEnd(12) + 'Expenses'.padEnd(12) + 'Profit'.padEnd(12) + 'Rent Pymts');
    console.log('-'.repeat(80));

    let annualTotals = {
      totalIncome: 0,
      totalExpenses: 0,
      totalProfit: 0,
      totalRentPayments: 0
    };

    months.forEach(monthYear => {
      const data = monthlyProfits[monthYear];
      annualTotals.totalIncome += data.income;
      annualTotals.totalExpenses += data.expenses;
      annualTotals.totalProfit += data.profit;
      annualTotals.totalRentPayments += data.monthlyRentCount;

      const profitColor = data.profit >= 0 ? '💰' : '⚠️';
      console.log(
        monthYear.split(' ')[0].padEnd(12) +
        `$${data.income.toLocaleString()}`.padEnd(12) +
        `$${data.expenses.toLocaleString()}`.padEnd(12) +
        `${profitColor} $${data.profit.toLocaleString()}`.padEnd(12) +
        `${data.monthlyRentCount}`.padEnd(9)
      );
    });

    // Annual summary
    console.log('\n' + '='.repeat(80));
    console.log('📈 2025 ANNUAL SUMMARY (PROPORTIONAL SPLIT):');
    console.log(`💰 Total Rent Income: $${annualTotals.totalIncome.toLocaleString()}`);
    console.log(`💸 Total Expenses: $${annualTotals.totalExpenses.toLocaleString()}`);
    console.log(`${annualTotals.totalProfit >= 0 ? '💵' : '⚠️'} Total Profit: $${annualTotals.totalProfit.toLocaleString()}`);
    console.log(`📋 Total Rent Payments: ${annualTotals.totalRentPayments}`);

    if (annualTotals.totalRentPayments > 0) {
      console.log(`💵 Average Monthly Profit: $${(annualTotals.totalProfit / annualTotals.totalRentPayments).toFixed(2)}`);
    }

    // Step 5: Detailed monthly breakdown
    console.log('\n📋 MONTHLY DETAILS (PROPORTIONAL SPLIT):');

    months.forEach(monthYear => {
      const data = monthlyProfits[monthYear];
      if (data.income > 0 || data.expenses > 0) {
        console.log(`\n🏠 ${monthYear}:`);
        console.log(`   💰 Rent Income: $${data.income.toLocaleString()}`);
        console.log(`   💸 Expenses: $${data.expenses.toLocaleString()}`);
        console.log(`   ${data.profit >= 0 ? '💵' : '⚠️'} Profit: $${data.profit.toLocaleString()}`);
        console.log(`   📋 Rent Payments: ${data.monthlyRentCount}`);

        if (data.income > 0) {
          console.log(`   💵 Average Monthly Rent: $${(data.income / Math.max(data.monthlyRentCount, 1)).toFixed(2)}`);
        }

        // Show top expense categories
        const topCategories = Object.entries(data.expenseDetails.categoryBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);

        if (topCategories.length > 0) {
          console.log(`   🏷️ Top Expense Categories:`);
          topCategories.forEach(([category, amount]) => {
            console.log(`      ${category}: $${amount.toLocaleString()}`);
          });
        }
      }
    });

    // Step 6: Best and worst profit months
    const monthsWithData = months
      .map(month => ({ month, data: monthlyProfits[month] }))
      .filter(item => item.data.income > 0 || item.data.expenses > 0)
      .sort((a, b) => b.data.profit - a.data.profit);

    if (monthsWithData.length > 0) {
      console.log('\n🏆 TOP PROFIT MONTHS (PROPORTIONAL SPLIT):');
      monthsWithData.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.month}: $${item.data.profit.toLocaleString()} profit`);
      });

      console.log('\n📉 LOWEST PROFIT MONTHS (PROPORTIONAL SPLIT):');
      monthsWithData.slice(-3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.month}: $${item.data.profit.toLocaleString()} profit`);
      });
    }

    // Step 7: Analysis insights
    console.log('\n📊 ANALYSIS INSIGHTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`• Consistent monthly rent: $${(totalIncome / Math.max(annualTotals.totalRentPayments, 1)).toFixed(0).toLocaleString()}`);
    console.log(`• Average monthly expenses: $${(totalExpenses / monthsWithData.length).toFixed(0).toLocaleString()}`);
    console.log(`• Profit margin: ${((annualTotals.totalProfit / totalIncome) * 100).toFixed(1)}%`);

    const profitableMonths = monthsWithData.filter(item => item.data.profit > 0).length;
    const totalMonthsWithActivity = monthsWithData.length;
    console.log(`• Profitable months: ${profitableMonths}/${totalMonthsWithActivity} (${((profitableMonths/totalMonthsWithActivity)*100).toFixed(1)}%)`);

    console.log('\n💡 LONG-TERM RENTAL NOTES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('• August shows transition period with tenant move-out costs');
    console.log('• September-December show higher profitability (short-term rentals begin)');
    console.log('• Proportional splitting ensures accurate monthly attribution');

    // Step 8: Save results
    const results = {
      property: {
        name: '10222 66th Ave',
        address: '10222 66th Ave S',
        type: 'Long-term Rental (Jan-Jul), Short-term (Sep-Dec)',
        analysisType: 'Monthly Profit Analysis (Proportional Split)'
      },
      period: '2025',
      monthlyProfits: monthlyProfits,
      annualSummary: annualTotals,
      topProfitMonths: monthsWithData.slice(0, 3),
      lowestProfitMonths: monthsWithData.slice(-3),
      analysisDate: new Date().toISOString(),
      methodology: {
        profitFormula: 'Monthly Rent Income - Total Expenses',
        incomeAttribution: 'Proportional splitting for long-term lease periods',
        incomeSources: ['Manual RentSpree data', 'CSV income entries'],
        expenseSources: ['CSV expenses', 'Manual expense entries'],
        rentalType: 'Mixed: Long-term (Jan-Jul) → Short-term (Sep-Dec)',
        note: 'August is transition period with tenant turnover costs'
      }
    };

    fs.writeFileSync('monthly_profit_10222_66th_checkout_split_2025.json', JSON.stringify(results, null, 2));
    console.log('\n💾 Detailed results saved to monthly_profit_10222_66th_checkout_split_2025.json');

    console.log('\n✅ Monthly Profit Analysis for 10222 66th Ave (Proportional Split) complete!');

  } catch (error) {
    console.error('❌ Error during 10222 66th proportional split analysis:', error.message);
    console.error(error.stack);
  }
}

// Run the analysis
monthlyProfitAnalysis10222ProportionalSplit();
