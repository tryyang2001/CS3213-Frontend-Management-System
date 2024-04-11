import { z } from "zod";

export const UpdateAssignmentValidator = z.object({
  assignmentId: z.string(),
  title: z.string().min(1).max(255).optional(),
  authors: z
    .array(z.number().int().positive())
    .nonempty("At least one author is required")
    .optional(),
  isPublished: z.boolean().optional(),
  deadline: z
    .number()
    .int()
    .positive()
    .refine((val) => val > Date.now(), "Deadline must be in the future")
    .optional(),
  description: z.string().min(1).max(50000).optional(),
});

export type UpdateAssignmentBody = z.infer<typeof UpdateAssignmentValidator>;
