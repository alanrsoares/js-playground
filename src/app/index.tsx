import { useCallback, useEffect } from "react";
import { Button } from "react-daisyui";

import { Code, Play } from "lucide-react";
import tw from "styled-cva";

import { Editor } from "~/components/Editor";
import { Result } from "~/components/Result";
import { useEval } from "~/hooks/useEval";
import useKeyBindings from "~/lib/hooks/useKeyBindings";
import useLocalStorageState from "~/lib/hooks/useLocalStorageState";
import usePrettierFormatter from "~/lib/hooks/usePrettierFormatter";
import { Maybe } from "~/lib/monad";

const DEFAULT_CODE = `// Write your JavaScript code here
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
    DEFAULT_CODE,
  );
  const { result, error, evaluateCode } = useEval();

  const format = usePrettierFormatter();

  // Function to update the URL with the current code
  const updateURLWithCode = useCallback((code: string) => {
    const encodedCode = encodeURIComponent(code);
    const newURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?code=${encodedCode}`;
    window.history.replaceState(null, "", newURL);
  }, []);

  // Function to load code from the URL
  const loadCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code")) {
      return Maybe.of(urlParams.get("code")).map(decodeURIComponent);
    }
    return Maybe.ofFalsy<string>();
  }, []);

  // On component mount, check URL for code
  useEffect(() => {
    const urlCode = loadCodeFromURL();
    urlCode.map(setCode);
  }, [loadCodeFromURL, setCode]);

  useEffect(() => {
    updateURLWithCode(code);
  }, [code, updateURLWithCode]);

  const handleFormat = useCallback(async () => {
    try {
      const formatted = await format(code);

      Maybe.of(formatted).map(setCode);
    } catch (err) {
      console.error("Formatting error:", err);
    }
  }, [code, format, setCode]);

  useKeyBindings([
    {
      key: "Enter",
      modifiers: {
        ctrlKey: true,
      },
      callback: (e) => {
        e.preventDefault();
        evaluateCode(code);
      },
    },
    {
      key: "f",
      modifiers: {
        ctrlKey: true,
        shiftKey: true,
      },
      callback: async (e) => {
        e.preventDefault();
        await handleFormat();
      },
    },
  ]);

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
