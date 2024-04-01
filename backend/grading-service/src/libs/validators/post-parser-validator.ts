import { z } from "zod";

export const PostParserValidator = z.object({
  language: z
    .string()
    .refine(
      (lang) => lang === "py" || lang === "c" || lang === "python",
      "Language not supported. (Only 'py' and 'c' are supported)"
    ),
  source_code: z.string().min(1),
});

export type PostParserBody = z.infer<typeof PostParserValidator>;
