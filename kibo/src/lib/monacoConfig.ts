import { loader } from "@monaco-editor/react";

let configured = false;

/**
 * Configure the Monaco Editor CDN path.
 * Safe to call multiple times — only runs once.
 */
export function configureMonaco() {
  if (configured) return;
  loader.config({
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs" },
  });
  configured = true;
}
