import { h } from "fuse";
import { defineApp, styled, VStack } from "../pmod";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

self.MonacoEnvironment = {
  getWorker: (_moduleId, label) => {
    if (label === "typescript" || label === "javascript") {
      return new Worker("/dist/ts.worker.js", { type: "module" });
    }
    return new Worker("/dist/editor.worker.js", { type: "module" });
  },
};

const EditorContainer = styled('div', {
  width: '100%',
  height: '100%',
  position: 'relative'
});

export const PmodEditorApp = defineApp({
  name: "CodeEditor",
  icon: "Code",
  width: 800,
  height: 600,
  content() {
    let containerRef: HTMLElement;
    let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
    
    setTimeout(() => {
      if (containerRef) {
        editorInstance = monaco.editor.create(containerRef, {
          value: "// Start coding in PMOD!\n",
          language: "typescript",
          theme: "vs-dark",
          automaticLayout: true,
        });
        
        // These aren't actually pmod types, that's next step.
        monaco.languages.typescript.typescriptDefaults.addExtraLib(`
          declare const pmod: {
            defineApp: (app: any) => void;
          };
        `);
      }
    }, 0);
    
    return (
      <EditorContainer ref={(el: HTMLElement) => containerRef = el} />
    );
  },
});