<template>
    <div>
      <h2 class="mb-3">Список учетных записей</h2>
      <ul class="list-group">
        <li v-for="account in accounts" :key="account.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ account.login }} ({{ account.type }})</span>
          <div>
            <button @click="editAccount(account.id)" class="btn btn-warning me-2">Редактировать</button>
            <button @click="removeAccount(account.id)" class="btn btn-danger">Удалить</button>
          </div>
        </li>
      </ul>
      <button @click="goToAddAccount" class="btn btn-success mt-3">Добавить учетную запись</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAccounts } from '@/composables/useAccounts';
  
  export default defineComponent({
    setup() {
      const { accounts, removeAccount } = useAccounts();
      const router = useRouter();
  
      const editAccount = (id: string) => {
        router.push(`/edit/${id}`);
      };
  
      const goToAddAccount = () => {
        router.push('/add');
      };
  
      return {
        accounts,
        removeAccount,
        editAccount,
        goToAddAccount,
      };
    },
  });
  </script>