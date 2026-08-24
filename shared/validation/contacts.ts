import * as z from "zod";

export const CONTACT_ROLES = ["Admin", "User", "Manager"] as const;

export const CONTACT_DEPARTMENTS = [
  "Продажи",
  "Маркетинг",
  "Разработка",
  "Поддержка",
] as const;

const optionalText = (maxLength: number) =>
  z
    .union([z.string().trim().max(maxLength), z.null()])
    .transform((value) => (value === "" ? null : value));

const optionalPhone = z
  .union([z.string().trim().max(30, "Номер телефона слишком длинный"), z.null()])
  .transform((value) => (value === "" ? null : value))
  .refine(
    (value) => value === null || /^[+\d\s()-]+$/.test(value),
    "Номер телефона содержит недопустимые символы",
  )
  .refine(
    (value) => value === null || value.replace(/\D/g, "").length === 11,
    "Введите номер телефона из 11 цифр",
  );

export const contactInputSchema = z.strictObject({
  name: z.string().trim().min(2, "Укажите имя").max(100, "Имя слишком длинное"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Некорректный email")
    .max(254, "Email слишком длинный"),

  phone: optionalPhone,

  role: z
    .union([z.enum(CONTACT_ROLES), z.literal(""), z.null()])
    .transform((value) => (value === "" ? null : value)),

  department: z
    .union([z.enum(CONTACT_DEPARTMENTS), z.literal(""), z.null()])
    .transform((value) => (value === "" ? null : value)),

  active: z.boolean(),

  avatarUrl: z
    .union([z.string().trim().max(500), z.null()])
    .transform((value) => (value === "" ? null : value)),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export const formatContactValidationError = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && errors[field] === undefined) {
      errors[field] = issue.message;
    }
  }
  return errors;
};
