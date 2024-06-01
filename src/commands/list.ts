import { Glob } from 'bun';
import { Command } from 'commander';

export const list = new Command()
  .name('list')
  .description('Lists the name of all available instruction modules.')
  .action(async () => {
    for await (const file of new Glob('*.ts').scan('./src/instructions')) {
      console.log(file.split('.')[0]);
    }
  });
