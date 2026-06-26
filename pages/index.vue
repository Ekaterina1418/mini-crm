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
      <AddForm @click="store.openModal" />
    </div>

    <UsersList :users="store.cards" @select="selectUser" />
    <ModalForm v-if="store.isVisible">
      <ClientForm
        :is-dirty="isDirty"
        form-class="form-modal"
        v-model="formClient"
        @save="save"
        @delete="store.deleteUser"
        @avatar-changed="isAvatarDirty = true"
      />
    </ModalForm>
  </main>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { isEqual, cloneDeep } from "lodash";
import { useCardStore } from "@/stores/cardsStore";
import { useAuthStore} from '~/stores/userStore';
import { INITIAL_FORM } from "#imports";
import type { FormClient } from "~/types/cardsTypes";

const store = useCardStore();
const userStore = useAuthStore();
const router = useRouter();
const formClient = ref<FormClient>(INITIAL_FORM);
const pristine = ref<FormClient>(cloneDeep(INITIAL_FORM));
const isAvatarDirty = ref<boolean>(false)
const reset = () => {
  Object.assign(formClient.value, INITIAL_FORM);
};
const isDirty = computed(() => {
  return !isEqual(formClient.value, pristine.value) || isAvatarDirty.value;
});

const save = (form: FormClient) => {
  if (form.id != null) {
    store.updateUser(form);
  } else {
    store.newUser(form);
  }
  reset();
  isAvatarDirty.value = false
  store.close();
};

const selectUser = (id: string) => {
  store.selectUser(id);
};

const logout = async () => {
  await userStore.logout();
  await router.push("/login");
};

onMounted(async() => {
  store.fetchCards();
  if (!userStore.isLoggedIn) {
    await userStore.me(); 
  }
  
});

watch(
  () => store.selectedUser,
  (user) => {
    if (user) {
      formClient.value = cloneDeep(user);
      pristine.value = cloneDeep(formClient.value);
      isAvatarDirty.value = false
    } else {
      formClient.value = cloneDeep(INITIAL_FORM);
      pristine.value = cloneDeep(formClient.value);
      isAvatarDirty.value = false
    }
  },
  { immediate: true }
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
