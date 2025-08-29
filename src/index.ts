#!/usr/bin/env node

import { Command } from 'commander';
import { config } from './utils/config.js';

// CLI Commands
import { AnalyticsCommand } from './cli/commands/analytics.js';
import { BookingsCommand } from './cli/commands/bookings.js';
import { ChatCommand } from './cli/commands/chat.js';
import { ConfigCommand } from './cli/commands/config.js';
import { FinancialCommand } from './cli/commands/financial.js';
import { GuestsCommand } from './cli/commands/guests.js';
import { MessagesCommand } from './cli/commands/messages.js';
import { PropertiesCommand } from './cli/commands/properties.js';
import { TestCommand } from './cli/commands/run-test.js';
import { WorkflowCommand } from './cli/commands/workflow.js';

const program = new Command();

program
  .name('short-term-rental-cli')
  .description('Global CLI tool for OwnerRez property management')
  .version('1.0.0');

// Add CLI commands
new AnalyticsCommand(program);
new BookingsCommand(program);
new ChatCommand(program);
new ConfigCommand(program);
new FinancialCommand(program);
new GuestsCommand(program);
new MessagesCommand(program);
new PropertiesCommand(program);
new TestCommand(program);
new WorkflowCommand(program);

// Parse command line arguments
program.parse();

console.log('Short Term Rental CLI tool ready');
