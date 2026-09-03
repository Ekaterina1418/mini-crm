import { describe, expect, it } from "vitest";
import {
  CONTACT_DEPARTMENTS,
  contactInputSchema,
} from "~/shared/validation/contacts";

const validContact = {
  name: "Иван Иванов",
  email: "ivan@example.com",
  phone: "+7 (911) 123-12-12",
  role: "Manager" as const,
  department: CONTACT_DEPARTMENTS[0],
  active: true,
  avatarUrl: null,
};

describe("contactInputSchema", () => {
  it("принимает и нормализует корректный контакт", () => {
    const result = contactInputSchema.parse({
      ...validContact,
      email: "  IVAN@EXAMPLE.COM ",
    });

    expect(result.email).toBe("ivan@example.com");
  });

  it("отклоняет некорректный email", () => {
    const result = contactInputSchema.safeParse({
      ...validContact,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет телефон без 11 цифр", () => {
    const result = contactInputSchema.safeParse({
      ...validContact,
      phone: "+7 911 123",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет неизвестные поля", () => {
    const result = contactInputSchema.safeParse({
      ...validContact,
      unexpected: "value",
    });

    expect(result.success).toBe(false);
  });
});
