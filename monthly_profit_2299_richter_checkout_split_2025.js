// Monthly Profit Analysis for 2299 Richter Street (Dunedin Duo) - 2025
// Profit = Income - Expenses (PROPORTIONAL SPLITTING for multi-month bookings)
//
// ⚠️ METHODOLOGY: Proportional Income Splitting (RECOMMENDED)
// - 1-month bookings: Income to checkout month
// - 2-3 month bookings: Income split proportionally across all months
// - Example: June 15-Aug 15 booking → income split across June, July, August

import fs from 'fs';

const OWNERREZ_BASE_URL = 'https://api.ownerrez.com';
const OWNERREZ_API_TOKEN = 'pt_lxwukgmjgq2c00zjoy84qbz9m6ehm8g4';
const OWNERREZ_EMAIL = 'troynowakrealty@gmail.com';
const OWNERREZ_USER_AGENT = 'DunedinDuo/1.0 (ownerrez-connector)';

// Helper function to make OwnerRez API calls
async function orFetch(endpoint, options = {}) {
  const credentials = btoa(`${OWNERREZ_EMAIL}:${OWNERREZ_API_TOKEN}`);
  const url = `${OWNERREZ_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'User-Agent': OWNERREZ_USER_AGENT,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OwnerRez API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Helper function to get month name and year from date
function getMonthYear(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Helper function to get days in month
function getDaysInMonth(monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Helper function to calculate number of nights between dates
function calculateNights(arrival, departure) {
  const start = new Date(arrival);
  const end = new Date(departure);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Split booking income proportionally across months
function splitBookingAcrossMonths(booking) {
  const arrival = new Date(booking.arrival);
  const departure = new Date(booking.departure);
  const totalAmount = booking.total_amount || 0;
  const totalNights = calculateNights(booking.arrival, booking.departure);

  const monthlySplits = {};

  // If booking is within one month, attribute to checkout month
  const arrivalMonth = getMonthYear(arrival);
  const departureMonth = getMonthYear(departure);

  if (arrivalMonth === departureMonth) {
    monthlySplits[departureMonth] = totalAmount;
    return monthlySplits;
  }

  // Multi-month booking - split proportionally
  let currentDate = new Date(arrival);
  let remainingAmount = totalAmount;
  let remainingNights = totalNights;

  while (currentDate < departure) {
    const currentMonth = getMonthYear(currentDate);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculate nights in this month
    const nightsInMonth = Math.min(
      calculateNights(currentDate, departure),
      calculateNights(currentDate, monthEnd) + 1
    );

    // Proportional amount for this month
    const monthAmount = totalAmount * (nightsInMonth / totalNights);

    if (!monthlySplits[currentMonth]) {
      monthlySplits[currentMonth] = 0;
    }
    monthlySplits[currentMonth] += monthAmount;

    // Move to next month
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  return monthlySplits;
}

// Parse expenses CSV file
function parseExpenses(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');

  const expenses = {};

  // Initialize monthly expenses
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];

  months.forEach(month => {
    expenses[`${month} 2025`] = {
      totalExpenses: 0,
      categoryBreakdown: {},
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

    if (!date || isNaN(amount) || amount === 0) continue;

    const monthYear = getMonthYear(new Date(date));
    if (expenses[monthYear]) {
      expenses[monthYear].totalExpenses += Math.abs(amount); // Use absolute value for expenses
      expenses[monthYear].transactions.push({
        date,
        amount: Math.abs(amount),
        description,
        category
      });

      // Category breakdown
      if (!expenses[monthYear].categoryBreakdown[category]) {
        expenses[monthYear].categoryBreakdown[category] = 0;
      }
      expenses[monthYear].categoryBreakdown[category] += Math.abs(amount);
    }
  }

  return expenses;
}

// Group bookings by proportional income splitting
function groupBookingsByProportionalSplit(bookings) {
  const monthlyData = {};

  // Initialize all months
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];

  months.forEach(month => {
    monthlyData[`${month} 2025`] = {
      bookings: [],
      totalGrossRevenue: 0,
      totalBaseRental: 0,
      totalCleaningFees: 0,
      totalPlatformFees: 0,
      totalNights: 0,
      bookingCount: 0,
      multiMonthBookings: [],
      singleMonthBookings: []
    };
  });

  // Process each booking
  for (const booking of bookings) {
    const monthlySplits = splitBookingAcrossMonths(booking);
    const totalNights = calculateNights(booking.arrival, booking.departure);
    const monthsCount = Object.keys(monthlySplits).length;

    // Categorize booking
    if (monthsCount > 1) {
      // Multi-month booking
      Object.entries(monthlySplits).forEach(([monthYear, amount]) => {
        if (monthlyData[monthYear]) {
          monthlyData[monthYear].multiMonthBookings.push({
            ...booking,
            allocatedAmount: amount,
            totalNights: totalNights,
            monthsSpanned: monthsCount
          });
        }
      });
    } else {
      // Single month booking
      const monthYear = Object.keys(monthlySplits)[0];
      if (monthlyData[monthYear]) {
        monthlyData[monthYear].singleMonthBookings.push({
          ...booking,
          allocatedAmount: monthlySplits[monthYear]
        });
      }
    }

    // Add to overall booking count for each month that gets income
    Object.keys(monthlySplits).forEach(monthYear => {
      if (monthlyData[monthYear]) {
        monthlyData[monthYear].bookings.push(booking);
        monthlyData[monthYear].bookingCount++;
      }
    });
  }

  return monthlyData;
}

// Analyze fee breakdown for a booking
async function analyzeBookingFees(booking) {
  try {
    const bookingDetails = await orFetch(`/v2/bookings/${booking.id}?include_charges=true&include_fees=true`);

    let baseRental = 0;
    let cleaningFee = 0;
    let taxes = 0;
    let otherFees = 0;
    let platformFees = 0;

    // Calculate nights
    const nights = calculateNights(booking.arrival, booking.departure);

    if (bookingDetails.charges && Array.isArray(bookingDetails.charges)) {
      bookingDetails.charges.forEach(charge => {
        const amount = parseFloat(charge.amount) || 0;
        const description = (charge.description || '').toLowerCase();

        if (description.includes('clean') || description.includes('cleaning')) {
          cleaningFee += amount;
        } else if (description.includes('tax') || description.includes('surtax') || description.includes('sales')) {
          taxes += amount;
        } else if (description.includes('rent') || description.includes('night') || description.includes('accommodation')) {
          baseRental += amount;
        } else {
          otherFees += amount;
        }
      });
    } else {
      // Fallback if no detailed charges - estimate based on patterns
      const total = booking.total_amount || 0;
      baseRental = total * 0.85; // Estimate 85% base rental
      cleaningFee = total * 0.125; // Estimate 12.5% cleaning
      taxes = total * 0.025; // Estimate 2.5% taxes
    }

    // Calculate platform fees (estimate based on booking source)
    const listingSite = booking.listing_site || '';
    if (listingSite.toLowerCase().includes('airbnb')) {
      platformFees = (baseRental + otherFees) * 0.03; // 3% Airbnb fee
    } else {
      platformFees = (baseRental + otherFees) * 0.025; // 2.5% other sites
    }

    return {
      bookingId: booking.id,
      totalAmount: booking.total_amount || 0,
      baseRental,
      cleaningFee,
      taxes,
      otherFees,
      platformFees,
      nights,
      hasDetailedBreakdown: bookingDetails.charges ? true : false
    };
  } catch (error) {
    // Fallback estimation
    const total = booking.total_amount || 0;
    const nights = calculateNights(booking.arrival, booking.departure);

    return {
      bookingId: booking.id,
      totalAmount: total,
      baseRental: total * 0.85,
      cleaningFee: total * 0.125,
      taxes: total * 0.025,
      otherFees: total * 0.025,
      platformFees: total * 0.03,
      nights,
      hasDetailedBreakdown: false
    };
  }
}

// Main analysis function with proportional splitting
async function monthlyProfitAnalysisProportionalSplit() {
  console.log('🚀 Starting Monthly Profit Analysis for 2299 Richter (Proportional Split)...\n');

  try {
    // Step 1: Get the Dunedin Duo property
    console.log('📋 Fetching property information...');
    const propertiesResponse = await orFetch('/v2/properties');
    const allProperties = propertiesResponse.items || propertiesResponse.data || [];

    const dunedinDuo = allProperties.find(p => p.id === 417537); // 2299 Richter
    if (!dunedinDuo) {
      throw new Error('Dunedin Duo property not found');
    }

    console.log(`✅ Found: ${dunedinDuo.name} (ID: ${dunedinDuo.id})`);

    // Step 2: Fetch all 2025 bookings
    console.log('\n📅 Fetching 2025 bookings...');
    const fromDate = '2025-01-01';
    const toDate = '2025-12-31';

    const bookingsResponse = await orFetch(
      `/v2/bookings?property_ids=${dunedinDuo.id}&from=${fromDate}&to=${toDate}&limit=500&include_guest=true`
    );

    let bookings = bookingsResponse.items || bookingsResponse.data || [];
    bookings = bookings.filter(booking => {
      const departureYear = new Date(booking.departure).getFullYear();
      return departureYear === 2025;
    });

    console.log(`📊 Found ${bookings.length} bookings for 2025 (filtered by checkout date)`);

    // Step 3: Load and parse expenses
    console.log('\n💰 Loading expenses data...');
    const expensesCsv = fs.readFileSync('data/raw/rocket_money/2025/2299 richter credit and acocount expenses 2025.csv', 'utf8');
    const monthlyExpenses = parseExpenses(expensesCsv);

    console.log('✅ Expenses data loaded and parsed');

    // Step 4: Group bookings by proportional splitting
    console.log('\n📊 Processing proportional income splitting...');
    const monthlyIncome = groupBookingsByProportionalSplit(bookings);

    // Count multi-month bookings
    let totalMultiMonthBookings = 0;
    let totalSingleMonthBookings = 0;

    Object.values(monthlyIncome).forEach(monthData => {
      totalMultiMonthBookings += monthData.multiMonthBookings.length;
      totalSingleMonthBookings += monthData.singleMonthBookings.length;
    });

    console.log(`📈 Multi-month bookings: ${totalMultiMonthBookings}`);
    console.log(`📅 Single-month bookings: ${totalSingleMonthBookings}`);
    console.log('✅ Income splitting processed');

    // Step 5: Analyze each month's bookings
    console.log('\n💰 Analyzing monthly income and calculating profits...');

    for (const [monthYear, data] of Object.entries(monthlyIncome)) {
      if (data.bookings.length > 0) {
        console.log(`\n📅 Analyzing ${monthYear} (${data.bookings.length} bookings, ${data.multiMonthBookings.length} multi-month)...`);

        // Calculate total revenue for this month (already split proportionally)
        let monthlyRevenue = 0;
        let monthlyNights = 0;

        // Add single-month bookings
        data.singleMonthBookings.forEach(booking => {
          monthlyRevenue += booking.allocatedAmount;
          monthlyNights += calculateNights(booking.arrival, booking.departure);
        });

        // Add multi-month booking allocations
        data.multiMonthBookings.forEach(booking => {
          monthlyRevenue += booking.allocatedAmount;
          // For multi-month bookings, calculate proportional nights
          const totalBookingNights = booking.totalNights;
          const monthsSpanned = booking.monthsSpanned;
          monthlyNights += totalBookingNights / monthsSpanned;
        });

        data.totalGrossRevenue = monthlyRevenue;
        data.totalNights = monthlyNights;

        // For simplicity, estimate fees proportionally
        data.totalBaseRental = monthlyRevenue * 0.85;
        data.totalCleaningFees = monthlyRevenue * 0.125;
        data.totalPlatformFees = monthlyRevenue * 0.03;

        // Calculate net rental income
        data.netRentalIncome = data.totalGrossRevenue - data.totalCleaningFees - data.totalPlatformFees;

        // Additional metrics
        data.averageBookingValue = data.bookingCount > 0 ? data.totalGrossRevenue / data.bookingCount : 0;
        data.averageNightlyRate = data.totalNights > 0 ? data.totalGrossRevenue / data.totalNights : 0;

        // Utilization
        const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December']
                           .indexOf(monthYear.split(' ')[0]);
        const daysInMonth = getDaysInMonth(monthIndex, 2025);
        data.utilizationRate = Math.min((data.totalNights / daysInMonth) * 100, 100);
      }
    }

    // Step 6: Calculate monthly profits
    const monthlyProfits = {};
    const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
                   'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'];

    months.forEach(monthYear => {
      const income = monthlyIncome[monthYear];
      const expenses = monthlyExpenses[monthYear];

      monthlyProfits[monthYear] = {
        income: income.netRentalIncome || 0,
        expenses: expenses.totalExpenses || 0,
        profit: (income.netRentalIncome || 0) - (expenses.totalExpenses || 0),
        incomeDetails: income,
        expenseDetails: expenses
      };
    });

    // Step 7: Display results
    console.log('\n' + '='.repeat(140));
    console.log('💵 MONTHLY PROFIT ANALYSIS - 2299 RICHTER (DUNEDIN DUO) - 2025 (PROPORTIONAL SPLIT)');
    console.log('='.repeat(140));
    console.log('\n💡 PROFIT = Net Rental Income - Total Expenses (Multi-month bookings split proportionally)');

    console.log('\n📊 MONTHLY BREAKDOWN:');
    console.log('Month'.padEnd(12) + 'Net Income'.padEnd(12) + 'Expenses'.padEnd(12) + 'Profit'.padEnd(12) + 'Bookings'.padEnd(9) + 'Multi-Month');
    console.log('-'.repeat(95));

    let annualTotals = {
      totalIncome: 0,
      totalExpenses: 0,
      totalProfit: 0,
      totalBookings: 0,
      totalNights: 0,
      totalMultiMonthBookings: 0
    };

    months.forEach(monthYear => {
      const data = monthlyProfits[monthYear];
      annualTotals.totalIncome += data.income;
      annualTotals.totalExpenses += data.expenses;
      annualTotals.totalProfit += data.profit;
      annualTotals.totalBookings += data.incomeDetails.bookingCount;
      annualTotals.totalNights += data.incomeDetails.totalNights;
      annualTotals.totalMultiMonthBookings += data.incomeDetails.multiMonthBookings.length;

      const profitColor = data.profit >= 0 ? '💰' : '⚠️';
      console.log(
        monthYear.split(' ')[0].padEnd(12) +
        `$${data.income.toLocaleString()}`.padEnd(12) +
        `$${data.expenses.toLocaleString()}`.padEnd(12) +
        `${profitColor} $${data.profit.toLocaleString()}`.padEnd(12) +
        `${data.incomeDetails.bookingCount}`.padEnd(9) +
        `${data.incomeDetails.multiMonthBookings.length}`
      );
    });

    // Annual summary
    console.log('\n' + '='.repeat(95));
    console.log('📈 2025 ANNUAL SUMMARY (PROPORTIONAL SPLIT):');
    console.log(`💰 Total Net Income: $${annualTotals.totalIncome.toLocaleString()}`);
    console.log(`💸 Total Expenses: $${annualTotals.totalExpenses.toLocaleString()}`);
    console.log(`${annualTotals.totalProfit >= 0 ? '💵' : '⚠️'} Total Profit: $${annualTotals.totalProfit.toLocaleString()}`);
    console.log(`📋 Total Bookings: ${annualTotals.totalBookings}`);
    console.log(`🏠 Total Nights: ${annualTotals.totalNights}`);
    console.log(`🔄 Multi-Month Bookings: ${annualTotals.totalMultiMonthBookings}`);

    if (annualTotals.totalBookings > 0) {
      console.log(`📊 Average Profit per Booking: $${(annualTotals.totalProfit / annualTotals.totalBookings).toFixed(2)}`);
    }
    if (annualTotals.totalNights > 0) {
      console.log(`💵 Average Profit per Night: $${(annualTotals.totalProfit / annualTotals.totalNights).toFixed(2)}`);
    }

    // Multi-month booking analysis
    console.log('\n🔄 MULTI-MONTH BOOKING ANALYSIS:');
    const multiMonthPercentage = (annualTotals.totalMultiMonthBookings / bookings.length * 100).toFixed(1);
    console.log(`📊 ${annualTotals.totalMultiMonthBookings} out of ${bookings.length} bookings span multiple months (${multiMonthPercentage}%)`);
    console.log('💡 These bookings have been split proportionally across the months they span');

    // Step 8: Detailed monthly breakdown
    console.log('\n📋 MONTHLY DETAILS (PROPORTIONAL SPLIT):');

    months.forEach(monthYear => {
      const data = monthlyProfits[monthYear];
      if (data.incomeDetails.bookingCount > 0 || data.expenses > 0) {
        console.log(`\n🏠 ${monthYear}:`);
        console.log(`   💰 Net Income: $${data.income.toLocaleString()}`);
        console.log(`   💸 Expenses: $${data.expenses.toLocaleString()}`);
        console.log(`   ${data.profit >= 0 ? '💵' : '⚠️'} Profit: $${data.profit.toLocaleString()}`);

        if (data.incomeDetails.bookingCount > 0) {
          console.log(`   📊 Bookings: ${data.incomeDetails.bookingCount}`);
          console.log(`   🔄 Multi-Month: ${data.incomeDetails.multiMonthBookings.length}`);
          console.log(`   🏠 Nights: ${data.incomeDetails.totalNights.toFixed(0)}`);
          console.log(`   📈 Utilization: ${data.incomeDetails.utilizationRate.toFixed(1)}%`);
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

    // Step 9: Best and worst profit months
    const monthsWithData = months
      .map(month => ({ month, data: monthlyProfits[month] }))
      .filter(item => item.data.income > 0 || item.data.expenses > 0)
      .sort((a, b) => b.data.profit - a.data.profit);

    if (monthsWithData.length > 0) {
      console.log('\n🏆 BEST PROFIT MONTHS (PROPORTIONAL SPLIT):');
      monthsWithData.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.month}: $${item.data.profit.toLocaleString()} profit`);
      });

      console.log('\n📉 WORST PROFIT MONTHS (PROPORTIONAL SPLIT):');
      monthsWithData.slice(-3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.month}: $${item.data.profit.toLocaleString()} profit`);
      });
    }

    // Step 10: Save results
    const results = {
      property: {
        id: dunedinDuo.id,
        name: dunedinDuo.name,
        analysisType: 'Monthly Profit Analysis (Proportional Split)'
      },
      period: '2025',
      monthlyProfits: monthlyProfits,
      annualSummary: annualTotals,
      topProfitMonths: monthsWithData.slice(0, 3),
      lowestProfitMonths: monthsWithData.slice(-3),
      analysisDate: new Date().toISOString(),
      methodology: {
        profitFormula: 'Net Rental Income - Total Expenses',
        incomeGrouping: '⚠️ RECOMMENDED: Proportional splitting for multi-month bookings',
        incomeAttributionRule: 'Multi-month bookings split by nights in each month',
        expensesSource: '2299 richter credit and acocount expenses 2025.csv',
        importantNote: '✅ This provides the most accurate monthly revenue attribution'
      }
    };

    fs.writeFileSync('monthly_profit_2299_richter_checkout_split_2025.json', JSON.stringify(results, null, 2));
    console.log('\n💾 Detailed results saved to monthly_profit_2299_richter_checkout_split_2025.json');

    console.log('\n✅ Monthly Profit Analysis (Proportional Split) complete!');

  } catch (error) {
    console.error('❌ Error during proportional split analysis:', error.message);
    console.error(error.stack);
  }
}

// Run the analysis
monthlyProfitAnalysisProportionalSplit();
