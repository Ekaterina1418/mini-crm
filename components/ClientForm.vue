<template>
  <form @submit.prevent="onSave" :class="formClass">
    <Input label="Имя" v-model="modelValueRef.name" type="text" />
    <Input label="Почта" v-model="modelValueRef.email" type="text" />
    <Input label="Номер телефона" v-model="modelValueRef.phone" type="text" />
    <AvatarUploader v-model="avatarFile" v-model:avatar-url="avatarUrlModel"/>
    <Select label="Роль" v-model="modelValueRef.role" :values="ROLES" />
    <Select
      label="Отдел"
      v-model="modelValueRef.department"
      :values="DEPARTAMENT"
    />
    <Checkbox  v-model="modelValueRef.active"/>
    <div class="wrapper-btn">
      <Button label="Сохранить" :disabled="!isDirty" severity="primary" size="sm" type="submit"/>
      <Button v-if="modelValueRef.id" label="Удалить"  @click="$emit('delete')" severity="danger" size="sm" type="button"/>
    </div>
  </form>
</template>

<script setup lang="ts">
import { uploadAvatar } from '~/api/auth';
import Button from '~/shared/ui/Button/Button.vue';
import Checkbox from "~/shared/ui/Checkbox/Checkbox.vue";
import Input from "~/shared/ui/Input/Input.vue";
import Select from "~/shared/ui/Select/Select.vue";
import type { FormClient } from "~/types/cardsTypes";
const props = defineProps<{
  modelValue: FormClient;
  formClass: string;
  isDirty: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: FormClient): void;
  (e: "save", val: FormClient): void;
  (e: "delete"): void;
}>();

const { modelValue } = toRefs(props);
const modelValueRef = modelValue;
const avatarFile = ref<File | null>(null);
const avatarUrlModel = computed<string | null>({
  get: () => modelValueRef.value.avatarUrl ?? null,
  set: (val) => {
    modelValueRef.value.avatarUrl = val;
  },
});

watch(
  modelValueRef,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true }
);


const onSave = async () => {
  let avatarUrl = avatarUrlModel.value ?? null;

  if (avatarFile.value) {
    avatarUrl = await uploadAvatar(avatarFile.value);
  }

  emit("save", {
    ...modelValueRef.value,
    avatarUrl,
  });
};
</script>

<style scoped>
.wrapper-btn {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.save-btn {
  border-radius: 6px;
  padding: 6px 10px;
  max-width: 100px;
  margin: 20px 0 0 0;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.success {
  background-color: rgb(21, 140, 225);
}
.success:hover {
  background-color: rgb(17, 21, 218);
}
.danger {
  background-color: #ed4747;
}
.danger:hover {
  background-color: #550303fa;
}
</style>
