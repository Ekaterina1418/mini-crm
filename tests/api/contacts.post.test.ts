import { beforeEach, describe, expect, it, vi } from "vitest";

const { createContactMock, readBodyMock, requireAdminMock } = vi.hoisted(() => ({
  createContactMock: vi.fn(),
  readBodyMock: vi.fn(),
  requireAdminMock: vi.fn(),
}));

vi.mock("h3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("h3")>();
  return { ...actual, readBody: readBodyMock };
});

vi.mock("~/server/db/prisma", () => ({
  default: { contact: { create: createContactMock } },
}));

vi.mock("~/server/utils/requireAdmin", () => ({
  requireAdmin: requireAdminMock,
}));

vi.stubGlobal("defineEventHandler", (handler: unknown) => handler);

const { default: createContactHandler } = await import(
  "~/server/api/contacts/index.post"
);

const event = { node: { res: { statusCode: 200 } } };

describe("POST /api/contacts", () => {
  beforeEach(() => {
    event.node.res.statusCode = 200;
    requireAdminMock.mockResolvedValue({ id: "owner-1" });
  });

  it("возвращает 422 для некорректных данных", async () => {
    readBodyMock.mockResolvedValue({ email: "wrong" });

    await expect(createContactHandler(event as never)).rejects.toMatchObject({
      statusCode: 422,
    });
    expect(createContactMock).not.toHaveBeenCalled();
  });

  it("создаёт контакт от имени администратора", async () => {
    const body = {
      name: "Иван Иванов",
      email: "ivan@example.com",
      phone: "+7 (911) 123-12-12",
      role: null,
      department: null,
      active: true,
      avatarUrl: null,
    };
    const created = { id: "contact-1", ownerId: "owner-1", ...body };

    readBodyMock.mockResolvedValue(body);
    createContactMock.mockResolvedValue(created);

    await expect(createContactHandler(event as never)).resolves.toEqual({
      success: true,
      contact: created,
    });
    expect(createContactMock).toHaveBeenCalledWith({
      data: expect.objectContaining({ ownerId: "owner-1" }),
    });
    expect(event.node.res.statusCode).toBe(201);
  });
});


