import { Command } from 'commander';

export class FinancialCommand {
  constructor(program: Command) {
    const financial = program
      .command('financial')
      .description('Manage OwnerRez financial data (coming soon)');

    financial
      .command('summary')
      .description('Get financial summary')
      .action(async () => {
        console.log('💰 Financial management coming soon...');
        console.log('Use the chat command for now: ownerrez-cli chat "What\'s my income this month?"');
      });
  }
}
