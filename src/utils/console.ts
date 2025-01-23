const prettify = (arg: unknown) =>
  typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg);

export function createConsoleProxy() {
  let output: string[] = [];

  const log = (prefix: string | null, ...args: unknown[]) => {
    const result = args.map(prettify).join(" ");

    output.push(prefix ? `${prefix} ${result}` : result);
  };

  const $log = (prefix: string | null) => log.bind(console, prefix);

  const handler = {
    log: $log(null),
    error: $log("❌"),
    warn: $log("⚠️"),
    info: $log("ℹ️"),
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
