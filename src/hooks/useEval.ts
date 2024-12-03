import { useState, useCallback } from 'react';
import { createConsoleProxy } from '../utils/console';

export function useEval() {
  const [result, setResult] = useState('// Result will appear here');
  const [error, setError] = useState<string | null>(null);

  const evaluateCode = useCallback((code: string) => {
    const { proxy, getOutput, clearOutput } = createConsoleProxy();
    clearOutput();

    try {
      // Create a wrapper to capture both console output and return value
      const wrappedCode = `
        let __result;
        try {
          __result = (function() {
            ${code}
          })();
        } catch(e) {
          console.error(e);
          throw e;
        }
        return __result;
      `;

      // Replace console methods with our proxy
      const originalConsole = { ...console };
      Object.assign(console, proxy);

      // Evaluate the code
      const evaluatedResult = new Function(wrappedCode)();

      // Restore original console
      Object.assign(console, originalConsole);

      // Combine console output with the result
      const consoleOutput = getOutput();
      const resultOutput = typeof evaluatedResult === 'undefined' 
        ? '// undefined'
        : String(evaluatedResult);

      setResult([
        consoleOutput,
        consoleOutput && resultOutput ? '\n' : '',
        resultOutput !== '// undefined' ? `// Return value: ${resultOutput}` : resultOutput
      ].join(''));
      
      setError(null);
    } catch (err) {
      const consoleOutput = getOutput();
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(consoleOutput || '');
    }
  }, []);

  return { result, error, evaluateCode };
}