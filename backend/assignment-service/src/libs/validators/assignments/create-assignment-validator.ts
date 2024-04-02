import { z } from "zod";

export const CreateAssignmentValidator = z.object({
  title: z.string().min(1).max(255),
  deadline: z
    .number()
    .int()
    .positive()
    .refine((deadline) => deadline > Date.now(), {
      message: "Deadline must be in the future",
    }),
  authors: z.array(z.string()).nonempty("At least one author is required"),
  isPublished: z.boolean(),
});

export type CreateAssignmentBody = z.infer<typeof CreateAssignmentValidator>;
