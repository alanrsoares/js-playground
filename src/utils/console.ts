export function createConsoleProxy() {
  let output: string[] = [];

  const handler = {
    log: (...args: any[]) => {
      output.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    },
    error: (...args: any[]) => {
      output.push(`Error: ${args.map(arg => String(arg)).join(' ')}`);
    },
    warn: (...args: any[]) => {
      output.push(`Warning: ${args.map(arg => String(arg)).join(' ')}`);
    },
    info: (...args: any[]) => {
      output.push(args.map(arg => String(arg)).join(' '));
    },
    clear: () => {
      output = [];
    }
  };

  return {
    proxy: handler,
    getOutput: () => output.join('\n'),
    clearOutput: () => output = []
  };
}