import { useState } from "react";

import { Play } from "lucide-react";

import { Editor } from "./components/Editor";
import { Result } from "./components/Result";
import { useEval } from "./hooks/useEval";

const DEFAULT_CODE = `// Write your JavaScript code here
function fibonacci(n) {
  if (n <= 1) return n;
  console.log(\`Calculating fibonacci(\${n})\`);
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Starting fibonacci calculation...');
fibonacci(5);`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const { result, error, evaluateCode } = useEval();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">JavaScript Playground</h1>
          <p className="mt-2 opacity-90">
            Write and execute JavaScript code in real-time
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[500px] overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <h2 className="font-semibold text-white">Editor</h2>
              <button
                onClick={() => evaluateCode(code)}
                className="btn btn-circle btn-success btn-sm"
              >
                <Play className="size-4" />
              </button>
            </div>
            <Editor code={code} onChange={setCode} />
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="bg-gray-800 px-4 py-2">
              <h2 className="font-semibold text-white">Output</h2>
            </div>
            <Result result={result} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
