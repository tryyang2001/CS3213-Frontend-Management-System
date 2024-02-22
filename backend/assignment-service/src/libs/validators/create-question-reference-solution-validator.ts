import { z } from "zod";

export const createQuestionReferenceSolutionValidator = z.object({
  id: z.string(),
  language: z.string().min(1).max(255),
  code: z.string().min(1).max(100000),
});

export type CreateQuestionReferenceSolutionBody = z.infer<
  typeof createQuestionReferenceSolutionValidator
>;
