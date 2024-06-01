import { mkdir } from 'node:fs/promises';
import chalk from 'chalk';
import { Command } from 'commander';
import { z } from 'zod';
import type { Airspace } from '../types.ts';
import { handleError } from '../utils/handle-error.ts';

const generateOptionsSchema = z.object({
  instruction: z.string(),
  output: z.string().optional(),
});

export const generate = new Command()
  .name('generate')
  .description('Generates an OpenAIR instructions for a given airspace.')
  .requiredOption(
    '-i, --instruction <instruction>',
    'The name of the instruction module to generate. Use `list` to see all available instructions.',
  )
  .option(
    '-o, --output <output>',
    'The output directory for the generated instruction.',
  )
  .action(async (opts) => {
    try {
      const options = generateOptionsSchema.parse(opts);

      let module: { main: () => Airspace };

      try {
        module = await import(`../instructions/${options.instruction}.ts`);
      } catch (error) {
        throw new Error(
          `Error loading instruction module. "${options.instruction}" not found.`,
          { cause: error },
        );
      }

      const airspaceInstructions = module.main();

      if (options.output) {
        await mkdir(options.output, { recursive: true });

        await Bun.write(
          `${options.output}/${options.instruction}-airspaces.txt`,
          airspaceInstructions.join('\n'),
        );

        console.log(
          chalk.green('✔ Airspace instructions generated successfully!'),
        );
        console.log(
          chalk.grey(
            `\tWritten to ${options.output}/${options.instruction}-airspaces.txt`,
          ),
        );
      } else {
        for (const line of airspaceInstructions) {
          console.log(line);
        }
      }

      process.exit(0);
    } catch (error) {
      handleError(error);
    }
  });
