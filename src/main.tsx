import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.tsx";
import { Maybe } from "./lib/monad.ts";

Maybe.of(document.getElementById("root"))
  .map(createRoot)
  .map(({ render }) =>
    render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
