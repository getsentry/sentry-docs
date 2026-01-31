/**
 * NoOpTaskRunner - A task runner that does nothing.
 *
 * In tool prediction evals, we don't actually execute the tools.
 * We just verify that the AI correctly predicts which tools would be called.
 * The scorer handles the actual prediction logic.
 */
export function NoOpTaskRunner() {
  return async function runner(input: string) {
    // Simply return the input - the actual evaluation happens in the scorer
    return input;
  };
}
