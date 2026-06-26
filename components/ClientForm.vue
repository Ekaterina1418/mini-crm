<template>
  <form @submit.prevent="onSave" :class="formClass">
    <div class="form-heading">
      <h2>{{ localForm.id ? "Редактировать контакт" : "Новый контакт" }}</h2>
      <p>Заполните основные данные и сохраните карточку.</p>
    </div>
    <AppInput label="Имя" v-model="localForm.name" type="text" />
    <AppInput label="Почта" v-model="localForm.email" type="text" />
    <AppInput label="Номер телефона" v-model="localForm.phone" type="text" />
    <AvatarUploader v-model="avatarFile" v-model:avatar-url="avatarUrlModel" />
    <AppSelect label="Роль" v-model="localForm.role" :values="ROLES" />
    <AppSelect
      label="Отдел"
      v-model="localForm.department"
      :values="DEPARTAMENT"
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
import { cloneDeep } from "lodash";
import { uploadAvatar } from "~/api/auth";
import type { FormClient } from "~/types/cardsTypes";
const props = defineProps<{
  modelValue: FormClient;
  formClass: string;
  isDirty: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: FormClient): void;
  (e: "save", val: FormClient): void;
  (e: "avatarChanged"): void
  (e: "delete"): void;
}>();

const localForm = ref<FormClient>(cloneDeep(props.modelValue));

const avatarFile = ref<File | null>(null);
const avatarUrlModel = computed<string | null>({
  get: () => localForm.value.avatarUrl ?? null,
  set: (val) => {
    localForm.value.avatarUrl = val;
  },
});
watch(
  () => props.modelValue.id,
  () => {
    localForm.value = cloneDeep(props.modelValue);
  },
  {  immediate: true },
);
watch(
  localForm,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true },
);
watch(avatarFile, () => emit("avatarChanged"))
const onSave = async () => {
  let avatarUrl = avatarUrlModel.value ?? null;

  if (avatarFile.value) {
    avatarUrl = await uploadAvatar(avatarFile.value);
  }

  emit("save", {
    ...localForm.value,
    avatarUrl,
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
