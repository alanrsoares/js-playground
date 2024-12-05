import { FC } from "react";

import { AlertTriangle } from "lucide-react";

interface ResultProps {
  result: string;
  error: string | null;
}

export const Result: FC<ResultProps> = ({ result, error }) => {
  return (
    <div className="h-full w-full overflow-auto bg-gray-900 p-4 font-mono text-sm text-white">
      {error ? (
        <div className="flex items-start gap-2 text-red-400">
          <AlertTriangle className="mt-0.5 h-5 w-5" />
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  );
};
