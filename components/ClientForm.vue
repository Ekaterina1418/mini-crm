<template>
  <form @submit.prevent="onSave" :class="formClass">
    <div class="form-heading">
      <h2>{{ localForm.id ? "Редактировать контакт" : "Новый контакт" }}</h2>
      <p>Заполните основные данные и сохраните карточку.</p>
    </div>
    <AppInput label="Имя" v-model="localForm.name" type="text" />
    <AppInput label="Почта" v-model="localForm.email" type="email" />
    <AppInput label="Номер телефона" v-model="localForm.phone" type="tel" />
    <AvatarUploader v-model="localForm.avatarFile" v-model:avatar-url="localForm.avatarUrl" />
    <AppSelect label="Роль" v-model="localForm.role" :values="ROLES" />
    <AppSelect
      label="Отдел"
      v-model="localForm.department"
      :values="DEPARTMENT"
    />
    <AppCheckbox v-model="localForm.active" />
    <div class="wrapper-btn">
      <AppButton
        label="Сохранить"
        :disabled="!isDirty"
        severity="primary"
        size="sm"
        type="submit"
      />
      <AppButton
        v-if="localForm.id"
        label="Удалить"
        @click="$emit('delete')"
        severity="danger"
        size="sm"
        type="button"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";
import { uploadAvatar } from "~/api/files";
import type { ContactForm } from "~/types/contactTypes";

const props = defineProps<{
  contact: ContactForm;
  formClass: string;
}>();

const emit = defineEmits<{
  (e: "save", val: ContactForm): void;
  (e: "delete"): void;
}>();


const localForm = ref<ContactForm>(cloneDeep(props.contact))
const initialForm = ref<ContactForm>(cloneDeep(props.contact))

  const isDirty = computed(() => {
    return !isEqual(localForm.value, initialForm.value);
  })

watch(()=> localForm.value,
(newVal) => {
  localForm.value = cloneDeep(newVal)
})
const onSave = async () => {
  let avatarUrl = localForm.value.avatarUrl ?? null;

  if (localForm.value.avatarFile) {
    avatarUrl = await uploadAvatar(localForm.value.avatarFile);
  }

  emit("save", {
    ...localForm.value,
    avatarUrl,
    avatarFile: null,
  });
};
</script>

<style scoped>
.wrapper-btn {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
}

.form-heading {
  margin-bottom: 4px;
}

.form-heading h2 {
  color: var(--color-text);
  font-size: 22px;
  line-height: 1.2;
}

.form-heading p {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 14px;
}

@media (max-width: 520px) {
  .wrapper-btn {
    flex-direction: column;
  }

  .wrapper-btn :deep(.app-btn) {
    width: 100%;
  }
}
</style>
