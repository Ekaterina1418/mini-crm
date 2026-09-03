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

    <div v-if="store.isLoading" class="list-state" role="status">
      Загружаем контакты…
    </div>
    <div v-else-if="store.loadError" class="list-state list-state--error" role="alert">
      <p>{{ store.loadError }}</p>
      <button type="button" @click="store.fetchContacts">Попробовать снова</button>
    </div>
    <ContactsList v-else :contacts="store.contacts" @select="openEditModal" />
    <ModalForm v-if="store.isVisible"  :is-locked="isSaving || isDeleting || isDeleteDialogOpen">
      <ClientForm
        form-class="form-modal"
        :contact="formClient"
        :is-saving="isSaving"
        :submit-error="submitError"
        @save="save"
        @delete="openDeleteDialog"
      />
    </ModalForm>
    <AppConfirmDialog
      :is-open="isDeleteDialogOpen"
      :is-loading="isDeleting"
      :error="deleteError"
      title="Удалить контакт?"
      message="Это действие нельзя отменить."
      confirm-label="Удалить"
      cancel-label="Отмена"
      @confirm="confirmDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </main>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { cloneDeep } from "lodash";
import { useContactsStore } from "@/stores/contactsStore";
import { useAuthStore } from "~/stores/userStore";
import { uploadAvatar, deleteAvatar } from "~/api/files";
import { INITIAL_FORM } from "#imports";
import type { ContactForm } from "~/types/contactTypes";
import AppConfirmDialog from "~/components/ui/ConfirmDialog.vue";
import { useAppToast } from "~/shared/lib/useToast";

const store = useContactsStore();
const userStore = useAuthStore();
const router = useRouter();
const { showSuccess } = useAppToast();
const isSaving = ref(false);
const submitError = ref("");
const isDeleteDialogOpen = ref(false);
const isDeleting = ref(false);
const deleteError = ref("");
const formClient = ref<ContactForm>(cloneDeep(INITIAL_FORM));

const reset = () => {
  formClient.value = cloneDeep(INITIAL_FORM);
};

const openDeleteDialog = () => {
   deleteError.value = "";
  isDeleteDialogOpen.value = true;
};
const confirmDelete = async () => {
  if (!formClient.value.id || isDeleting.value) return;

  isDeleting.value = true;

  try {
    await store.deleteContact();
    isDeleteDialogOpen.value = false;
    showSuccess("Контакт удалён");
  } catch (error) {
    console.error("Ошибка при удалении контакта:", error);
    deleteError.value = "Не удалось удалить контакт. Попробуйте ещё раз.";
  } finally {
    isDeleting.value = false;
  }
};
const save = async (form: ContactForm) => {
  if (isSaving.value) return;

  isSaving.value = true;
  submitError.value = "";
  let uploadedAvatarUrl: string | null = null;

  try {
    let avatarUrl = form.avatarUrl ?? null;

    if (form.avatarFile) {
      avatarUrl = await uploadAvatar(form.avatarFile);
      uploadedAvatarUrl = avatarUrl;
    }

    const contact = {
      ...form,
      avatarUrl,
      avatarFile: null,
    };
    const isEditing = contact.id != null;

    if (isEditing) {
      await store.updateContact(contact);
    } else {
      await store.createContact(contact);
    }
    showSuccess(isEditing ? "Изменения сохранены" : "Контакт создан");
    reset();
    store.close();
  } catch (error: unknown) {
    if (uploadedAvatarUrl) {
      try {
        await deleteAvatar(uploadedAvatarUrl);
      } catch (cleanupError) {
        console.error("Не удалось удалить загруженный аватар:", cleanupError);
      }
    }
    const statusCode =
      error && typeof error === "object" && "statusCode" in error
        ? Number(error.statusCode)
        : undefined;

    if (statusCode === 413) {
      submitError.value = "Размер изображения не должен превышать 100 КБ.";
    } else if (statusCode === 415) {
      submitError.value = "Разрешены только изображения JPEG, PNG и WebP.";
    } else if (statusCode === 409) {
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

.list-state {
  display: grid;
  min-height: 220px;
  place-content: center;
  gap: 12px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text-muted);
  text-align: center;
}

.list-state--error {
  color: var(--color-danger);
}

.list-state button {
  min-height: 40px;
  border-radius: var(--radius-md);
  padding: 8px 14px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
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
