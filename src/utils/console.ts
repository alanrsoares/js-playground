const prettify = (arg: unknown) =>
  typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg);

export function createConsoleProxy() {
  let output: string[] = [];

  const handler = {
    log: (...args: unknown[]) => {
      output.push(args.map(prettify).join(" "));
    },
    error: (...args: unknown[]) => {
      output.push(`Error: ${args.map(prettify).join(" ")}`);
    },
    warn: (...args: unknown[]) => {
      output.push(`Warning: ${args.map(prettify).join(" ")}`);
    },
    info: (...args: unknown[]) => {
      output.push(`Info: ${args.map(prettify).join(" ")}`);
    },
    clear: () => {
      output = [];
    },
  };

  return {
    proxy: handler,
    getOutput: () => output.join("\n"),
    clearOutput: () => (output = []),
  };
}
