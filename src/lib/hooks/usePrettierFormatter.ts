import { useCallback } from "react";

import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import prettier from "prettier/standalone";

function usePrettierFormatter() {
  return useCallback(async (code: string) => {
    try {
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [estree, babel],
      });

      return formatted;
    } catch (err) {
      console.error("Formatting error:", err);
    }
  }, []);
}

export default usePrettierFormatter;
