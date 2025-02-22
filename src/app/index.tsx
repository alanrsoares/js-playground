import { useCallback, useEffect } from "react";
import { Button, Tooltip } from "react-daisyui";

import { PlayIcon, Wand2Icon, XIcon } from "lucide-react";
import tw from "styled-cva";

import { Editor } from "~/components/Editor";
import { Layout } from "~/components/Layout";
import { Result } from "~/components/Result";
import { useEval } from "~/hooks/useEval";
import { AppLogo } from "~/icons/AppLogo";
import useKeyBindings from "~/lib/hooks/useKeyBindings";
import useLocalStorageState from "~/lib/hooks/useLocalStorageState";
import usePrettierFormatter from "~/lib/hooks/usePrettierFormatter";
import { Maybe } from "~/lib/monad";
import { DEFAULT_CODE } from "./constants";

function safeDecodeURIComponent(encoded: string) {
  try {
    return window.decodeURIComponent(encoded);
  } catch {
    return "";
  }
}

const CardContainer = tw.div`
  h-[500px] rounded-lg shadow-lg
`;

const CardHeader = tw.div`
  bg-gray-800 px-4 h-14 py-2 flex items-center justify-between
`;

function App() {
  const [code, setCode] = useLocalStorageState(
    "js-playground-code",
    DEFAULT_CODE,
  );
  const { result, error, evaluateCode, clearOutput } = useEval();

  const format = usePrettierFormatter();

  const updateURLWithCode = useCallback((code: string) => {
    const encodedCode = encodeURIComponent(code);
    const newURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?code=${encodedCode}`;
    window.history.replaceState(null, "", newURL);
  }, []);

  const loadCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return Maybe.of(urlParams.get("code")).map(safeDecodeURIComponent);
  }, []);

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

  const handleEvaluate = useCallback(() => {
    evaluateCode(code);
  }, [code, evaluateCode]);

  useKeyBindings([
    {
      key: "Enter",
      modifiers: {
        ctrlKey: true,
      },
      callback: handleEvaluate,
    },
    {
      key: "f",
      modifiers: {
        ctrlKey: true,
        shiftKey: true,
      },
      callback: handleFormat,
    },
  ]);

  return (
    <Layout
      title={
        <>
          <AppLogo className="size-[0.75em]" />
          JS Playground
        </>
      }
      subtitle="Write and execute JavaScript code in real-time"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardContainer>
          <CardHeader>
            <h2 className="font-semibold text-white">Editor</h2>
            <div className="flex gap-2">
              <Tooltip message="Format code (Ctrl+Shift+F)">
                <Button
                  onClick={handleFormat}
                  shape="circle"
                  size="sm"
                  color="info"
                >
                  <Wand2Icon className="size-[1em]" />
                </Button>
              </Tooltip>
              <Tooltip message="Run code (Ctrl+Enter)">
                <Button
                  onClick={evaluateCode.bind(null, code)}
                  shape="circle"
                  size="sm"
                  color="success"
                  className="hover:animate-pulse"
                >
                  <PlayIcon className="size-[1em]" />
                </Button>
              </Tooltip>
            </div>
          </CardHeader>
          <Editor code={code} onChange={setCode} />
        </CardContainer>
        <CardContainer>
          <CardHeader>
            <h2 className="font-semibold text-white">Output</h2>
            <div className="flex gap-2">
              <Tooltip message="Clear output">
                <Button onClick={clearOutput} shape="circle" size="sm">
                  <XIcon className="size-[1em]" />
                </Button>
              </Tooltip>
            </div>
          </CardHeader>
          <Result result={result} error={error} />
        </CardContainer>
      </div>
    </Layout>
  );
}

export default App;
