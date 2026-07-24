import type { Contact, ContactForm } from "~/types/contactTypes";

export const useContactsStore = defineStore("contacts", () => {
  const contacts = ref<Contact[]>([]);
  const isVisible = ref(false);
  const selectedContactId = ref<string | null>(null);

  const toContactPayload = (form: ContactForm) => {
    const { avatarFile, ...payload } = form;

    return payload;
  };

  const fetchContacts = async () => {
    try {
      const data = await $fetch<{ contacts: Contact[] }>("/api/contacts");
      contacts.value = data.contacts;
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const selectedContact = computed(() =>
    selectedContactId.value == null
      ? null
      : (contacts.value.find((contact) => contact.id === selectedContactId.value) ?? null),
  );

  const openEditModal = (id: string) => {
    selectedContactId.value = id;
    isVisible.value = true;
  };

  const createContact = async (form: ContactForm) => {
    try {
      const data = await $fetch<{
        success: boolean;
        contact: Contact;
      }>("/api/contacts", {
        method: "POST",
        body: toContactPayload(form),
      });
      if (data.success) {
        const contact = data.contact;
        contacts.value.push(contact);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const updateContact = async (form: ContactForm) => {
    try {
      const data = await $fetch<{
        success: boolean;
        contact: Contact;
      }>(`/api/contacts/${form.id}`, {
        method: "PUT",
        body: toContactPayload(form),
      });
      if (data.success) {
        const index = contacts.value.findIndex((contact) => contact.id === form.id);
        if (index !== -1) {
          contacts.value.splice(index, 1, { ...data.contact } as Contact);
        }
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async () => {
    try {
      const data = await $fetch<{ success: boolean }>(
        `/api/contacts/${selectedContactId.value}`,
        { method: "DELETE" },
      );
      if (data.success) {
        contacts.value = contacts.value.filter((contact) => contact.id !== selectedContactId.value);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      close();
    }
  };

  const openCreateModal = () => {
    selectedContactId.value = null;
    isVisible.value = true;
  };

  const close = () => {
    selectedContactId.value = null;
    isVisible.value = false;
  };

  return {
    contacts,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    isVisible,
    openCreateModal,
    close,
    selectedContact,
    selectedContactId,
    openEditModal,
  };
});
