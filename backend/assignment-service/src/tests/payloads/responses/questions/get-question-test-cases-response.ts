/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */

export const getQuestionTestCasesDbResponse = () => [
  {
    id: "test-case-id-1",
    input: "input-1",
    output: "expected-output-1",
    isPublic: true,
  },
  {
    id: "test-case-id-2",
    input: "input-2",
    output: "expected-output-2",
    isPublic: false,
  },
];

export const getQuestionTestCasesExpectedResponse = () => [
  {
    id: "test-case-id-1",
    input: "input-1",
    output: "expected-output-1",
    isPublic: true,
  },
  {
    id: "test-case-id-2",
    input: "input-2",
    output: "expected-output-2",
    isPublic: false,
  },
];
