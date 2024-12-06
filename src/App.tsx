import { useCallback } from "react";
import { Button } from "react-daisyui";

import { Code, Play } from "lucide-react";
import tw from "styled-cva";

import { Editor } from "~/components/Editor";
import { Result } from "~/components/Result";
import { useEval } from "~/hooks/useEval";
import useLocalStorageState from "~/lib/hooks/useLocalStorageState";
import usePrettierFormatter from "~/lib/hooks/usePrettierFormatter";
import { Maybe } from "~/lib/monad";

const INITIAL_CODE = `// Write your JavaScript code here
function fibonacci(n) {
  if (n <= 1) return n;
  console.log(\`Calculating fibonacci(\${n})\`);
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Starting fibonacci calculation...');

return fibonacci(5);`;

const CardContainter = tw.div`
  h-[500px] overflow-hidden rounded-lg shadow-lg
`;

const CardHeader = tw.div`
  bg-gray-800 px-4 h-14 py-2 flex items-center justify-between
`;

function App() {
  const [code, setCode] = useLocalStorageState(
    "js-playground-code",
    INITIAL_CODE,
  );
  const { result, error, evaluateCode } = useEval();

  const format = usePrettierFormatter();

  const handleFormat = useCallback(async () => {
    try {
      const formatted = await format(code);

      Maybe.of(formatted).map(setCode);
    } catch (err) {
      console.error("Formatting error:", err);
    }
  }, [code, format, setCode]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">JS Playground</h1>
          <p className="mt-2 opacity-90">
            Write and execute JavaScript code in real-time
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardContainter>
            <CardHeader>
              <h2 className="font-semibold text-white">Editor</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleFormat}
                  shape="circle"
                  size="sm"
                  color="info"
                >
                  <Code className="size-[1em]" />
                </Button>
                <Button
                  onClick={evaluateCode.bind(null, code)}
                  shape="circle"
                  size="sm"
                  color="success"
                  className="hover:animate-pulse"
                >
                  <Play className="size-[1em]" />
                </Button>
              </div>
            </CardHeader>
            <Editor code={code} onChange={setCode} />
          </CardContainter>
          <CardContainter>
            <CardHeader>
              <h2 className="font-semibold text-white">Output</h2>
            </CardHeader>
            <Result result={result} error={error} />
          </CardContainter>
        </div>
      </div>
    </div>
  );
}

export default App;
