import { useCallback, useEffect } from "react";
import { Button } from "react-daisyui";

import { Code, Play } from "lucide-react";
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

  const updateURLWithCode = useCallback((code: string) => {
    const encodedCode = encodeURIComponent(code);
    const newURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?code=${encodedCode}`;
    window.history.replaceState(null, "", newURL);
  }, []);

  const loadCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return Maybe.of(urlParams.get("code")).map(decodeURIComponent);
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
    </Layout>
  );
}

export default App;
