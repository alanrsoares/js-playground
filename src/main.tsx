import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./app";
import { Maybe } from "./lib/monad.ts";

localStorage.clear();

Maybe.of(document.getElementById("root"))
  .map(createRoot)
  .map((root) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
