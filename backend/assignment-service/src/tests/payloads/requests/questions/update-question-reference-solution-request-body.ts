export const getUpdateQuestionReferenceSolutionRequestBody = (): {
  language: "python" | "c";
  code: string;
} => {
  return {
    language: "c" as "python" | "c",
    code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
  };
};
