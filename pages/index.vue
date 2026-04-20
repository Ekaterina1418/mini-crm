<template>
  <AddForm @click="store.openModal" />
  <UsersList :users="store.cards" @select="selectUser" />
  <ModalForm v-if="store.isVisible">
    <ClientForm
      :is-dirty="isDirty"
      form-class="form-modal"
      v-model="formClient"
      @save="save"
      @delete="store.deleteUser"
    />
  </ModalForm>
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
const formClient = ref<FormClient>(INITIAL_FORM);
const pristine = ref<FormClient>(cloneDeep(INITIAL_FORM));
const reset = () => {
  Object.assign(formClient.value, INITIAL_FORM);
};
const isDirty = computed(() => {
  return !isEqual(formClient.value, pristine.value);
});

const save = (form: FormClient) => {
  if (form.id != null) {
    store.updateUser(form);
  } else {
    store.newUser(form);
  }
  reset();
  store.close();
};

const selectUser = (id: string) => {
  store.selectUser(id);
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
    } else {
      formClient.value = cloneDeep(INITIAL_FORM);
      pristine.value = cloneDeep(formClient.value);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  gap: 12px;
  margin-bottom: 50px;
}
.form-modal {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 70%;
}
</style>
