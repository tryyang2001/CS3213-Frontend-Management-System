import { z } from "zod";

export const CreateQuestionValidator = z.object({
  assignmentId: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(50000),
  deadline: z
    .number()
    .int()
    .positive()
    .refine((deadline) => deadline > Date.now(), {
      message: "Deadline must be in the future",
    }),
  testCases: z
    .array(
      z.object({
        input: z.string().max(10000),
        output: z.string().max(10000),
        isPublic: z.boolean().optional(),
      })
    )
    .min(1)
    .optional(),
  referenceSolution: z
    .object({
      language: z
        .string()
        .transform((lang) => lang.toLowerCase())
        .refine(
          (lang) => lang === "python" || lang === "py" || lang === "c",
          "Only python and c languages are supported"
        )
        .transform((lang) => (lang === "py" ? "python" : lang)),
      code: z.string().min(1).max(10000),
    })
    .optional(),
});

export type CreateQuestionBody = z.infer<typeof CreateQuestionValidator>;
