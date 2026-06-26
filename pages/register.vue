<template>
  <div class="page">
    <form @submit.prevent="onRegister" class="form">
      <div class="form__header">
        <p>Mini CRM</p>
        <h1>Регистрация</h1>
      </div>
      <label class="form__field">
        <span>Email</span>
        <input v-model="email" class="form__input" placeholder="name@example.com" />
      </label>
      <label class="form__field">
        <span>Пароль</span>
        <input
          v-model="password"
          type="password"
          class="form__input"
          placeholder="Минимум 8 символов"
        />
      </label>
      <label class="form__field">
        <span>Имя</span>
        <input v-model="name" class="form__input" placeholder="Ваше имя" />
      </label>
      <AppButton label="Зарегистрироваться" severity="primary" size="md" type="submit"/>
      <p class="form__sub">
        Уже есть аккаунт?
        <NuxtLink :to="{ path: '/login' }" class="form__link"> Войти </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore} from '~/stores/userStore';
import { useRouter } from "vue-router";
import { useAppToast } from '~/shared/lib/useToast';


const email = ref("");
const password = ref("");
const name = ref("");
const router = useRouter();
const userStore = useAuthStore();
const { showError } = useAppToast();

const onRegister = async () => {
  const { data, error } = await userStore.register(email.value, password.value, name.value);

  if (error.value) {
    showError("Ошибка запроса");
    return;
  }

  const res = data.value;
  if (!res) {
    showError("Нет ответа от сервера");
    return;
  }

  if (!res.success) {
    showError(res.message);
    return;
  }
  router.push('/login');

};
</script>
<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 20px;
}

.form {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}
.form__header {
  margin-bottom: 4px;
}
.form__header p {
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}
.form__header h1 {
  margin-top: 4px;
  font-size: 30px;
  line-height: 1.1;
}
.form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 600;
}
.form__input {
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
}
.form__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
.form__input::placeholder {
  color: #94a3b8;
}
.form__sub {
  margin: 6px 0 0;
  text-align: center;
  font-size: 14px;
  color: var(--color-text-muted);
}
.form__link {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
