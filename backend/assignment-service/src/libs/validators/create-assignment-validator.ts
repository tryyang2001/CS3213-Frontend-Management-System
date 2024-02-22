import { z } from "zod";

export const CreateAssignmentValidator = z.object({
  title: z.string().min(1).max(255),
  questions: z
    .array(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1).max(255),
        deadline: z
          .number()
          .int()
          .refine((deadline) => deadline > Date.now(), {
            message: "Deadline must be in the future",
          }),
        examples: z
          .array(
            z.object({
              input: z.string().min(1).max(255),
              output: z.string().min(1).max(255),
              explanation: z.string().min(1).max(255).optional(),
            })
          )
          .optional(),
        constraints: z.array(z.string()).optional(),
        referenceSolutionId: z.string().optional(),
      })
    )
    .nonempty("At least one question is required"),
  authors: z.array(z.string()).nonempty("At least one author is required"),
});

export type CreateAssignmentBody = z.infer<typeof CreateAssignmentValidator>;
