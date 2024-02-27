import { z } from "zod";

export const CreateTestCasesValidator = z.object({
  questionId: z.string(),
  testCases: z
    .array(
      z.object({
        input: z.string().max(10000),
        output: z.string().max(10000),
        isPublic: z.boolean().optional(),
      })
    )
    .nonempty(),
});

export type CreateQuestionTestCasesBody = z.infer<
  typeof CreateTestCasesValidator
>;
