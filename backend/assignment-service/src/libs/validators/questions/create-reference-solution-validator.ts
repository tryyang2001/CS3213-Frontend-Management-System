import { z } from "zod";

export const createReferenceSolutionValidator = z.object({
  id: z.string(),
  language: z
    .string()
    .transform((lang) => lang.toLowerCase())
    .refine(
      (lang) => lang === "python" || lang === "py" || lang === "c",
      "Only python and c languages are supported"
    )
    .transform((lang) => (lang === "py" ? "python" : lang)),
  code: z.string().min(1).max(100000),
});

export type CreateQuestionReferenceSolutionBody = z.infer<
  typeof createReferenceSolutionValidator
>;
