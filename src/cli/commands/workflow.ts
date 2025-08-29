import { Command } from 'commander';

export class WorkflowCommand {
  constructor(program: Command) {
    const workflow = program
      .command('workflow')
      .description('Manage OwnerRez business workflows (coming soon)');

    workflow
      .command('list')
      .description('List available workflows')
      .action(async () => {
        console.log('🔄 Business workflows coming soon...');
        console.log('Use the test command for now: ownerrez-cli test workflow guest-inquiry-to-booking');
      });
  }
}
