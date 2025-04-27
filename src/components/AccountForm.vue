<template>
    <div>
      <h2 class="mb-3">{{ isEditing ? 'Редактировать учетную запись' : 'Добавить учетную запись' }}</h2>
      <form @submit.prevent="handleSubmit" class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Тип:</label>
          <select v-model="account.type" class="form-select">
            <option value="Local">Локальный</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>
  
        <div class="col-md-6">
          <label class="form-label">Логин:</label>
          <input
            v-model="account.login"
            required
            class="form-control"
            :class="{ 'is-invalid': !isValidLogin }"
          />
          <div v-if="!isValidLogin" class="invalid-feedback">
            Логин должен содержать минимум 3 символа.
          </div>
        </div>
  
        <div class="col-md-6" v-if="account.type === 'Local'">
          <label class="form-label">Пароль:</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="account.password"
              required
              class="form-control"
              :class="{ 'is-invalid': !isValidPassword }"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? 'Скрыть' : 'Показать' }}
            </button>
          </div>
          <div v-if="!isValidPassword" class="invalid-feedback">
            Пароль должен содержать минимум 6 символов.
          </div>
        </div>
  
        <div class="col-md-6">
          <label class="form-label">Теги:</label>
          <input v-model="newTag" @keydown.enter="addTag" class="form-control" />
          <ul class="mt-2">
            <li v-for="(tag, index) in account.tags" :key="index" class="badge bg-secondary me-2">
              {{ tag.text }}
            </li>
          </ul>
        </div>
  
        <div class="col-12">
          <button
            type="submit"
            class="btn btn-primary me-2"
            :disabled="!isValidForm"
          >
            {{ isEditing ? 'Сохранить' : 'Добавить' }}
          </button>
          <button type="button" @click="cancel" class="btn btn-secondary">
            Отмена
          </button>
        </div>
      </form>
    </div>
  </template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccounts } from '@/composables/useAccounts';

interface FormData {
  id?: string;
  type: 'Local' | 'LDAP';
  login: string;
  password?: string;
  tags: { text: string }[];
}

export default defineComponent({
  setup() {
    const { accounts, addAccount, updateAccount } = useAccounts();
    const router = useRouter();
    const route = useRoute();

    const accountId = route.params.id as string | undefined;
    const isEditing = computed(() => !!accountId);

    const account = reactive<FormData>({
      type: 'Local',
      login: '',
      password: '',
      tags: [],
    });

    if (isEditing.value) {
      const existingAccount = accounts.find((a) => a.id === accountId);
      if (existingAccount) {
        Object.assign(account, existingAccount);
      }
    }

    const newTag = ref('');
    const showPassword = ref(false);

    const addTag = () => {
      if (newTag.value.trim()) {
        account.tags.push({ text: newTag.value.trim() });
        newTag.value = '';
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const isValidLogin = computed(() => account.login.trim().length >= 3);

    const isValidPassword = computed(() => {
      return account.type !== 'Local' || (account.password && account.password.trim().length >= 6);
    });

    const isValidForm = computed(() => {
      return isValidLogin.value && isValidPassword.value;
    });

    const handleSubmit = () => {
      if (!isValidForm.value) return;

      if (isEditing.value) {
        updateAccount(accountId!, account);
      } else {
        addAccount(account);
      }
      router.push('/');
    };

    const cancel = () => {
      router.push('/');
    };

    return {
      account,
      newTag,
      showPassword,
      addTag,
      togglePasswordVisibility,
      isValidLogin,
      isValidPassword,
      isValidForm,
      handleSubmit,
      cancel,
      isEditing,
    };
  },
});
</script>