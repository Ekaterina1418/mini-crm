<template>
  <div class="page">
    <form @submit.prevent="onRegister" class="form">
      <input v-model="email" class="form__input" placeholder="Email" />
      <input
        v-model="password"
        type="password"
        class="form__input"
        placeholder="Пароль"
      />
      <input v-model="name" class="form__input" placeholder="Имя" />
      <Button label="Зарегистрироваться" severity="primary" size="sm" type="submit"/>
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
import Button from '~/shared/ui/Button/Button.vue';


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
  max-width: 540px;
  padding: 28px;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.form__input {
  width: 80%;
  padding: 5px;
  border: 1px solid #c0c0c0;
  border-radius: 6px;
  outline: none;
}
.form__input::placeholder {
  font-size: 15px;
  color: #000;
}
.form__sub {
  margin: 6px 0 0;
  text-align: center;
  font-size: 14px;
  color: #444;
}
.form__link {
  color: #1d4ed8;
  font-weight: 600;
}
</style>
