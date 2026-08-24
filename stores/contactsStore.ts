import type { Contact, ContactForm } from "~/types/contactTypes";

export const useContactsStore = defineStore("contacts", () => {
  const contacts = ref<Contact[]>([]);
  const isVisible = ref(false);
  const selectedContactId = ref<string | null>(null);

  const toContactPayload = (form: ContactForm) => {
    const { id, avatarFile, ...payload } = form;

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
    const data = await $fetch<{
      success: true;
      contact: Contact;
    }>("/api/contacts", {
      method: "POST",
      body: toContactPayload(form),
    });

    contacts.value.push(data.contact);
  };

  const updateContact = async (form: ContactForm) => {
    const data = await $fetch<{
      success: true;
      contact: Contact;
    }>(`/api/contacts/${form.id}`, {
      method: "PUT",
      body: toContactPayload(form),
    });

    const index = contacts.value.findIndex((contact) => contact.id === form.id);
    if (index !== -1) {
      contacts.value.splice(index, 1, data.contact);
    }
  };

  const deleteContact = async () => {
    const contactId = selectedContactId.value;
    await $fetch<{ success: true }>(`/api/contacts/${contactId}`, {
      method: "DELETE",
    });

    contacts.value = contacts.value.filter((contact) => contact.id !== contactId);
    close();
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
