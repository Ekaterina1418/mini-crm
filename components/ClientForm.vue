<template>
  <form :class="formClass" @submit.prevent="onSave">
    <div class="form-heading">
      <h2>{{ localForm.id ? "Редактировать контакт" : "Новый контакт" }}</h2>
      <p>Заполните основные данные и сохраните карточку.</p>
    </div>
    <AppInput v-model="localForm.name" label="Имя" type="text" :error="errors.name" />
    <AppInput v-model="localForm.email" label="Почта" type="email" :error="errors.email" />
    <AppInput v-model="localForm.phone" label="Номер телефона" type="tel" :error="errors.phone" />
    <AvatarUploader v-model="localForm.avatarFile" v-model:avatar-url="localForm.avatarUrl" />
    <AppSelect v-model="localForm.role" label="Роль" :values="ROLES" />
    <AppSelect v-model="localForm.department" label="Отдел" :values="DEPARTMENT" />
    <AppCheckbox v-model="localForm.active" />
    <p v-if="submitError" class="form-error" role="alert">
      {{ submitError }}
    </p>
    <div class="wrapper-btn">
      <AppButton
        :label="isSaving ? 'Сохранение...' : 'Сохранить'"
        :disabled="!isDirty || isSaving"
        severity="primary"
        size="sm"
        type="submit"
      />
      <AppButton
        v-if="localForm.id"
        label="Удалить"
        :disabled="isSaving"
        severity="danger"
        size="sm"
        type="button"
        @click="$emit('delete')"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual, pick } from "lodash";
import type { ContactForm } from "~/types/contactTypes";
import {
  contactInputSchema,
  formatContactValidationError,
} from "~/shared/validation/contacts";

const props = defineProps<{
  contact: ContactForm;
  formClass: string;
  isSaving: boolean;
  submitError: string;
}>();

const emit = defineEmits<{
  (e: "save", val: ContactForm): void;
  (e: "delete"): void;
}>();

const localForm = ref<ContactForm>(cloneDeep(props.contact));
const initialForm = ref<ContactForm>(cloneDeep(props.contact));
const errors = ref<Record<string, string | undefined>>({});

const isDirty = computed(() => {
  return !isEqual(localForm.value, initialForm.value);
});

watch(
  () => props.contact,
  (newVal) => {
    localForm.value = cloneDeep(newVal);
    initialForm.value = cloneDeep(newVal);
    errors.value = {};
  },
  { immediate: true },
);

const onSave = () => {
  if (props.isSaving) return;

  const payload = pick(localForm.value, [
    "name",
    "email",
    "phone",
    "role",
    "department",
    "active",
    "avatarUrl",
  ])
  const { id, avatarFile } = localForm.value;
  const result = contactInputSchema.safeParse(payload);

  if (!result.success) {
    errors.value = formatContactValidationError(result.error);
    return;
  }

  errors.value = {};
  emit("save", {
    ...result.data,
    ...(id ? { id } : {}),
    avatarFile,
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

.form-error {
  margin: 0;
  color: var(--color-danger, #dc2626);
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
