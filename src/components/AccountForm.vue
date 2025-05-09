<template>
  <div>
    <h2 class="mb-4 text-dark">{{ isEditing ? 'Редактировать учетную запись' : 'Добавить учетную запись' }}</h2>
    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow-sm">

      <div class="mb-3">
        <label class="form-label">Тип:</label>
        <select v-model="account.type" class="form-select form-select-sm rounded">
          <option value="Local">Локальный</option>
          <option value="LDAP">LDAP</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Логин:</label>
        <input
          v-model="account.login"
          required
          class="form-control"
          :class="{ 'is-invalid': showErrorLogin }"
          @blur="validateLogin"
        />
        <div v-if="showErrorLogin" class="invalid-feedback">
          Логин должен содержать минимум 3 символа.
        </div>
      </div>

      <div class="mb-3" v-show="account.type === 'Local'">
        <label class="form-label">Пароль:</label>
        <div :class="['input-group', { 'is-invalid': showErrorPassword }]">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="account.password"
            required
            class="form-control"
            @blur="validatePassword"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
        <div v-if="showErrorPassword" class="invalid-feedback">
          Пароль должен содержать минимум 6 символов.
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Теги:</label>
        <input
          v-model="rawTagsInput"
          @keydown.enter="addTag"
          placeholder="Введите через точку с запятой"
          class="form-control form-control-sm mb-2"
        />
        <small class="text-muted d-block mb-2">Пример: dev; prod; staging</small>

        <div class="tag-container border rounded p-2 bg-light" style="min-height: 50px;">
          <span
            v-for="(tag, index) in displayedTags"
            :key="index"
            class="badge bg-light text-dark border me-1 mb-1"
            style="font-size: 0.8rem;"
          >
            {{ tag.text }}
          </span>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button
          type="submit"
          class="btn btn-primary btn-sm px-4"
          :disabled="!isValidForm"
        >
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </button>
        <button type="button" @click="cancel" class="btn btn-outline-secondary btn-sm px-4">
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountsStore } from '../stores/account';

export default defineComponent({
  setup() {
    const accountsStore = useAccountsStore();
    const router = useRouter();
    const route = useRoute();

    const rawTagsInput = ref('');

    const parseTagsFromString = (input: string): { text: string }[] => {
      return input
        .split(';')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .map(tag => ({ text: tag }));
    };

    const accountId = route.params.id as string | undefined;
    const isEditing = computed(() => !!accountId);

    const account = reactive({
      id: '',
      type: 'Local' as 'Local' | 'LDAP',
      login: '',
      password: '',
      tags: [] as { text: string }[],
    });

    if (isEditing.value) {
      const existingAccount = accountsStore.accounts.find(a => a.id === accountId);
      if (existingAccount) {
        Object.assign(account, existingAccount);
        rawTagsInput.value = existingAccount.tags.map(t => t.text).join('; ');
      }
    }

    const showPassword = ref(false);
    const showErrorLogin = ref(false);
    const showErrorPassword = ref(false);

    const addTag = () => {
      const trimmed = rawTagsInput.value.trim();
      if (trimmed && !trimmed.endsWith(';')) {
        rawTagsInput.value = trimmed + '; ';
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const validateLogin = () => {
      showErrorLogin.value = account.login.trim().length < 3;
    };

    const validatePassword = () => {
      if (account.type === 'Local') {
        const trimmedPassword = account.password?.trim() || '';
        showErrorPassword.value = trimmedPassword.length < 6;
      } else {
        showErrorPassword.value = false;
      }
    };

    const isValidForm = computed(() => {
      return !showErrorLogin.value && !showErrorPassword.value;
    });

    const displayedTags = computed(() => parseTagsFromString(rawTagsInput.value));

    const handleSubmit = () => {
      validateLogin();
      validatePassword();

      if (!isValidForm.value) return;

      account.tags = parseTagsFromString(rawTagsInput.value);

      if (isEditing.value) {
        accountsStore.updateAccount(account.id, account);
      } else {
        accountsStore.addAccount(account);
      }

      router.push('/');
    };

    const cancel = () => {
      router.push('/');
    };

    watchEffect(() => {
      account.tags = parseTagsFromString(rawTagsInput.value);
    });

    watchEffect(() => {
      if (account.type !== 'Local') {
        showErrorPassword.value = false;
      }
    });

    return {
      account,
      rawTagsInput,
      showPassword,
      showErrorLogin,
      showErrorPassword,
      addTag,
      togglePasswordVisibility,
      validateLogin,
      validatePassword,
      isValidForm,
      handleSubmit,
      cancel,
      isEditing,
      displayedTags,
    };
  },
});
</script>