import { z } from "zod";

export const PostFeedbackValidator = z.object({
  language: z
    .string()
    .transform((lang) => lang.toLowerCase())
    .refine(
      (lang) => lang === "py" || lang === "python" || lang === "c",
      "Language not supported. (Only 'py' and 'c' are supported)"
    )
    .transform((lang) => {
      if (lang === "python") {
        return "py";
      }

      return lang;
    }),
  source_code: z.string().min(1),
  question_id: z.string(),
  student_id: z.number().positive(),
});

export type PostFeedbackBody = z.infer<typeof PostFeedbackValidator>;
