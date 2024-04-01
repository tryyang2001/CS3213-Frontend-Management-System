"use client";

import { MutableRefObject, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface Props {
  code?: string;
  feedback?: {
    line: number;
    hints: string[];
  };
}

export default function FeedbackCodeEditor({ code, feedback }: Props) {
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null> =
    useRef(null);

  const newDecoration: monaco.editor.IModelDeltaDecoration[] = feedback
    ? [
        {
          range: new monaco.Range(feedback.line, 1, feedback.line, 1),
          options: {
            isWholeLine: true,
            className: "bg-yellow-200",
          },
        },
      ]
    : [];

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    if (feedback) {
      editor.createDecorationsCollection(newDecoration);
      editor.focus();
    }
  };

  return (
    <div>
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
          readOnly: true,
        }}
        height="55vh"
        language="python"
        onMount={onMount}
        value={code}
      />
    </div>
  );
}
