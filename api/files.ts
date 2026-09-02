export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const data = await $fetch<{ success: true; avatarUrl: string }>(
    "/api/contacts/upload-avatar",
    {
      method: "POST",
      body: formData,
    },
  );

  return data.avatarUrl;
};

export const deleteAvatar = async (avatarUrl: string) => {
  const data = await $fetch<{ success: true }>("/api/contacts/delete-avatar", {
    method: "DELETE",
    body: { avatarUrl },
  });
  return data;
};
