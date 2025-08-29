import { Command } from 'commander';

export class MessagesCommand {
  constructor(program: Command) {
    const messages = program
      .command('messages')
      .description('Manage OwnerRez messages (coming soon)');

    messages
      .command('list')
      .description('List messages')
      .action(async () => {
        console.log('💬 Messages management coming soon...');
        console.log('Use the API directly for now.');
      });
  }
}
