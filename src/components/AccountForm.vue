<template>
    <div>
      <h2>{{ isEditing ? 'Редактировать учетную запись' : 'Добавить учетную запись' }}</h2>
      <form @submit.prevent="handleSubmit">
        <label>
          Тип:
          <select v-model="account.type">
            <option value="Local">Локальный</option>
            <option value="LDAP">LDAP</option>
          </select>
        </label>
        <label>
          Логин:
          <input v-model="account.login" required />
        </label>
        <label v-if="account.type === 'Local'">
          Пароль:
          <input type="password" v-model="account.password" required />
        </label>
        <label>
          Теги:
          <input v-model="newTag" @keydown.enter="addTag" />
          <ul>
            <li v-for="(tag, index) in account.tags" :key="index">{{ tag.text }}</li>
          </ul>
        </label>
        <button type="submit">{{ isEditing ? 'Сохранить' : 'Добавить' }}</button>
        <button type="button" @click="cancel">Отмена</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref, computed } from 'vue';
  import { useAccountsStore } from '@/pinia/account';
  import { useRouter, useRoute } from 'vue-router';
  
  interface FormData {
    id?: string;
    type: 'Local' | 'LDAP';
    login: string;
    password?: string;
    tags: { text: string }[];
  }
  
  export default defineComponent({
    setup() {
      const accountsStore = useAccountsStore();
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
        const existingAccount = accountsStore.accounts.find((a) => a.id === accountId);
        if (existingAccount) {
          Object.assign(account, existingAccount);
        }
      }
  
      const newTag = ref('');
  
      const addTag = () => {
        if (newTag.value.trim()) {
          account.tags.push({ text: newTag.value.trim() });
          newTag.value = '';
        }
      };
  
      const handleSubmit = () => {
        if (isEditing.value) {
          accountsStore.updateAccount(accountId!, account);
        } else {
          accountsStore.addAccount(account);
        }
        router.push('/');
      };
  
      const cancel = () => {
        router.push('/');
      };
  
      return {
        account,
        newTag,
        addTag,
        handleSubmit,
        cancel,
        isEditing,
      };
    },
  });
  </script>