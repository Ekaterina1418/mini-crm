import type { ContactForm } from "~/types/contactTypes";

export const INITIAL_FORM: ContactForm = {
  name: "",
  email: "",
  avatarUrl: null,
  avatarFile: null,
  role: "",
  phone: "",
  department: "",
  active: true,
};

export const DEPARTMENT = ["Продажи", "Маркетинг", "Разработка", "Поддержка"];
export const ROLES = ["Admin", "User", "Manager"];
