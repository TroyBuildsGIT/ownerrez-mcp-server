import { Command } from 'commander';

export class AnalyticsCommand {
  constructor(program: Command) {
    const analytics = program
      .command('analytics')
      .description('OwnerRez analytics and insights (coming soon)');

    analytics
      .command('dashboard')
      .description('Show analytics dashboard')
      .action(async () => {
        console.log('📊 Analytics dashboard coming soon...');
        console.log('Use the chat command for now: ownerrez-cli chat "Show me my business status"');
      });
  }
}
