<template>
  <main class="crm-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Mini CRM</p>
        <h1>Контакты</h1>
      </div>
      <button class="logout-button" type="button" title="Выйти" @click="logout">
        <Icon name="tabler:logout" size="20" />
        <span>Выйти</span>
      </button>
    </header>

    <div class="toolbar">
      <div>
        <h2>База контактов</h2>
        <p>Создавайте карточки, обновляйте данные и отслеживайте активность.</p>
      </div>
      <AddForm @click="store.openCreateModal" />
    </div>

    <ContactsList :contacts="store.contacts" @select="openEditModal" />
    <ModalForm v-if="store.isVisible">
      <ClientForm form-class="form-modal" :contact="formClient" :is-saving="isSaving" :submit-error="submitError"
        @save="save" @delete="store.deleteContact" />
    </ModalForm>
  </main>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { cloneDeep } from "lodash";
import { useContactsStore } from "@/stores/contactsStore";
import { useAuthStore } from "~/stores/userStore";
import { uploadAvatar } from "~/api/files";
import { INITIAL_FORM } from "#imports";
import type { ContactForm } from "~/types/contactTypes";

const store = useContactsStore();
const userStore = useAuthStore();
const router = useRouter();
const isSaving = ref(false);
const submitError = ref("");
const formClient = ref<ContactForm>(cloneDeep(INITIAL_FORM));
const reset = () => {
  formClient.value = cloneDeep(INITIAL_FORM);
};

const save = async (form: ContactForm) => {
  if (isSaving.value) return;

  isSaving.value = true;
  submitError.value = "";
  try {
    let avatarUrl = form.avatarUrl ?? null;

    if (form.avatarFile) {
      avatarUrl = await uploadAvatar(form.avatarFile);
    }

    const contact = {
      ...form,
      avatarUrl,
      avatarFile: null,
    };

    if (contact.id != null) {
      await store.updateContact(contact);
    } else {
      await store.createContact(contact);
    }
    reset();
    store.close();
  } catch (error: unknown) {
    const statusCode =
      error &&
        typeof error === "object" &&
        "statusCode" in error
        ? Number(error.statusCode)
        : undefined;

    if (statusCode === 409) {
      submitError.value = " Контакт  с таким email уже существует.";

    } else {
      submitError.value =
        "Не удалось сохранить контакт. Проверьте данные и попробуйте ещё раз.";
    }
  } finally {
    isSaving.value = false;
  }
};

const openEditModal = (id: string) => {
  store.openEditModal(id);
};

const logout = async () => {
  await userStore.logout();
  await router.push("/login");
};

onMounted(async () => {
  store.fetchContacts();
  if (!userStore.isLoggedIn) {
    await userStore.me();
  }
});

watch(
  () => store.selectedContact,
  (contact) => {
    formClient.value = contact
      ? {
        ...cloneDeep(contact),
        avatarFile: null,
      }
      : cloneDeep(INITIAL_FORM);
  },
  { immediate: true },
);
</script>

<style scoped>
.crm-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header,
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 18px;
}

.eyebrow {
  margin-bottom: 4px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.page-header h1 {
  font-size: 32px;
  line-height: 1.1;
}

.toolbar {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.toolbar h2 {
  font-size: 20px;
}

.toolbar p {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.logout-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.logout-button:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
}

.form-modal {
  display: flex;
  flex-direction: column;
  width: min(100%, 520px);
  gap: 14px;
}

@media (max-width: 720px) {

  .page-header,
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .logout-button,
  .toolbar :deep(.add-button) {
    width: 100%;
  }
}
</style>
