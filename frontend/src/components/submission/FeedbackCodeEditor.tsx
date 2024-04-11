"use client";

import { MutableRefObject, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface Props {
  submission?: Submission;
}

export default function FeedbackCodeEditor({ submission }: Props) {
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null> =
    useRef(null);

  // const newDecoration: monaco.editor.IModelDeltaDecoration[] = feedback
  //   ? [
  //       {
  //         range: new monaco.Range(feedback.line, 1, feedback.line, 1),
  //         options: {
  //           isWholeLine: true,
  //           className: "bg-yellow-200",
  //         },
  //       },
  //     ]
  //   : [];

  const newDecoration: monaco.editor.IModelDeltaDecoration[] =
    submission?.feedbacks?.map((item) => ({
      range: new monaco.Range(item.line, 1, item.line, 1),
      options: {
        isWholeLine: true,
        className: "bg-yellow-200",
      },
    })) ?? [];

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    submission?.feedbacks?.forEach(() => {
      editor.createDecorationsCollection(newDecoration);
    });
    editor.focus();
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
        language={submission ? submission.language : "python"}
        onMount={onMount}
        value={submission ? submission.code : ""}
      />
    </div>
  );
}
