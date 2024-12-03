import { AlertTriangle } from "lucide-react";
import { FC } from "react";

interface ResultProps {
  result: string;
  error: string | null;
}

export const Result: FC<ResultProps> = ({ result, error }) => {
  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 font-mono text-sm overflow-auto">
      {error ? (
        <div className="flex items-start gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  );
};
