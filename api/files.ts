export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/contacts/upload-avatar", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.avatarUrl;
};


