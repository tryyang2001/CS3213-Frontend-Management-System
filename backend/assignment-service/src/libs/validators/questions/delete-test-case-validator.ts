import { z } from "zod";

export const DeleteTestCaseValidator = z.object({
  testCaseIds: z
    .array(z.string())
    .nonempty("At least one testCaseId is required"),
});

export type DeleteTestCaseBody = z.infer<typeof DeleteTestCaseValidator>;
