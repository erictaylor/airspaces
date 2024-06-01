#! /usr/bin/env bun
import { Command } from 'commander';
import packageInfo from '../package.json';
import { generate } from './commands/generate.ts';
import { list } from './commands/list.ts';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

const main = async (): Promise<void> => {
  const program = new Command()
    .name('airspaces')
    .description('A CLI tool for managing airspaces')
    .version(
      packageInfo.version,
      '-v, --version',
      'output the current version of the CLI tool',
    );

  program.addCommand(list).addCommand(generate);

  program.parse();
};

main();
