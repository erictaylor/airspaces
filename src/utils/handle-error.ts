export const handleError = (error: unknown): void => {
  if (typeof error === 'string') {
    console.error(error);
    process.exit(1);
  }

  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  }

  console.error('An unexpected error occurred.');
  console.error(error);
};
