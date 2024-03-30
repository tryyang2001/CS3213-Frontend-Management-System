import { z } from "zod";

export const UpdateAssignmentValidator = z.object({
  assignmentId: z.string(),
  title: z.string().min(1).max(255).optional(),
  authors: z.array(z.string()).min(1).optional(),
  isPublished: z.boolean().optional(),
  deadline: z
    .number()
    .int()
    .refine((val) => val > Date.now())
    .optional(),
  description: z.string().max(50000).optional(),
});

export type UpdateAssignmentBody = z.infer<typeof UpdateAssignmentValidator>;
