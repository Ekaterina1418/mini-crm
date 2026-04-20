<template>
  <div class="avatar-uploader">
    <Icon name="iconamoon:attachment" size="24px" />
    <label class="avatar-preview">
      <span>{{ fileName }}</span>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        name="avatar"
        @change="onFileChange"
      />
    </label>
    <button
      type="button"
      class="clear-btn"
      aria-label="Очистить выбранный файл"
      @click="onClear"
    >
      <Icon name="icomoon-free:cross" size="16px" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: File | null;
  avatarUrl?: string | null;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", val: File | null): void;
  (e: "update:avatarUrl", val: string | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const DEFAULT_FILE_NAME = "Файл не выбран";

const fileName = computed(() => {
  if (props.modelValue) {
    return props.modelValue.name;
  }

  if (!props.avatarUrl) {
    return DEFAULT_FILE_NAME;
  }

  const rawName = props.avatarUrl.split("/").pop() ?? "";
  const cleanName = rawName.split("?")[0]?.split("#")[0];

  return cleanName || DEFAULT_FILE_NAME;
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  emit("update:modelValue", file);
};

const onClear = () => {
  emit("update:modelValue", null);
  emit("update:avatarUrl", null);

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-preview input {
  display: none;
}

.avatar-preview span {
  display: block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
}
</style>
