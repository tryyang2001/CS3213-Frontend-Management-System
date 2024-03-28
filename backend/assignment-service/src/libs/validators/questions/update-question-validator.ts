import { z } from "zod";

export const UpdateQuestionValidator = z.object({
  questionId: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(50000).optional(),
  deadline: z
    .number()
    .int()
    .positive()
    .refine((deadline) => deadline > Date.now(), {
      message: "Deadline must be in the future",
    })
    .optional(),
});

export type UpdateQuestionBody = z.infer<typeof UpdateQuestionValidator>;
