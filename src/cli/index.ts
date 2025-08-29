#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
    .name('ownerrez-cli')
    .version('1.0.0');

program.parse();