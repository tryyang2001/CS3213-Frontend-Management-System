import { z } from "zod";

export const UpdateQuestionValidator = z.object({
  questionId: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(50000),
  deadline: z
    .number()
    .int()
    .refine((deadline) => deadline > Date.now(), {
      message: "Deadline must be in the future",
    }),
});

export type UpdateQuestionBody = z.infer<typeof UpdateQuestionValidator>;
