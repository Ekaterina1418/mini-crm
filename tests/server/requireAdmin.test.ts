import { describe, expect, it, vi } from "vitest";

const { requireAuthMock } = vi.hoisted(() => ({
  requireAuthMock: vi.fn(),
}));
vi.mock("~/server/utils/requireAuth", () => ({
  requireAuth: requireAuthMock,
}));

const { requireAdmin } = await import("~/server/utils/requireAdmin");

describe("requireAdmin", () => {
  it("возвращает администратора", async () => {
    const admin = {
      id: "admin-1",
      email: "admin@example.com",
      name: "Администратор",
      role: "admin",
      active: true,
    };
    requireAuthMock.mockResolvedValue(admin);
    await expect(requireAdmin({} as never)).resolves.toEqual(admin);
  });
  it("возвращает 403 для обычного пользователя", async () => {
    const user = {
      id: "user-1",
      email: "user@example.com",
      name: "Пользователь",
      role: "user",
      active: true,
    };
    requireAuthMock.mockResolvedValue(user);
    await expect(requireAdmin({} as never)).rejects
      .toMatchObject({ statusCode: 403, statusMessage: "Admin access required" });
  });
});
