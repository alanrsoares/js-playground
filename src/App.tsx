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
          <p className="opacity-90 mt-2">
            Write and execute JavaScript code in real-time
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px]">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <h2 className="text-white font-semibold">Editor</h2>
              <button
                onClick={() => evaluateCode(code)}
                className="btn btn-success btn-sm btn-circle"
              >
                <Play className="size-4" />
              </button>
            </div>
            <Editor code={code} onChange={setCode} />
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px]">
            <div className="bg-gray-800 px-4 py-2">
              <h2 className="text-white font-semibold">Output</h2>
            </div>
            <Result result={result} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
