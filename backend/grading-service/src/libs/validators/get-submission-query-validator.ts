import { z } from "zod";

export const GetSubmissionQueryValidator = z.object({
  studentId: z
    .string()
    .refine((id) => {
      const regex = /^[0-9]+$/;
      return regex.test(id);
    }, "Must be a valid student id")
    .transform((id) => parseInt(id, 10)),
});
