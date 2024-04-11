import { z } from "zod";

export const GetAssignmentsQueryValidator = z.object({
  userId: z
    .string()
    .refine((id) => {
      const parsedId = parseInt(id);
      return !isNaN(parsedId) && parsedId > 0;
    }, "Invalid userId format")
    .transform((id) => parseInt(id)),
  includePast: z
    .string()
    .refine((value) => value === "true" || value === "false")
    .transform((value) => value === "true")
    .optional(),
  isPublished: z
    .string()
    .refine((value) => value === "true" || value === "false")
    .transform((value) => value === "true")
    .optional(),
});

export type GetAssignmentsQuery = z.infer<typeof GetAssignmentsQueryValidator>;
