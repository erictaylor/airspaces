#! /usr/bin/env bun

const main = async () => {
  const instructionFlagIndex = process.argv.findIndex((arg) => arg === '--instruction' || arg === '-i');

  if (instructionFlagIndex === -1) {
    console.error('No instruction flag found. Please specify an instruction module to run.');
    process.exit(1);
  }

  const instructionModule = process.argv[instructionFlagIndex + 1];

  try {
    const { main } = await import(`./instructions/${instructionModule}`);
    main();
    process.exit(0);
  } catch (error) {
    console.error(`Error loading instruction module: ${instructionModule}`);
    console.error(error);
    process.exit(1);
  }
};

main();
