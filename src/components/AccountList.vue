<template>
    <div>
      <h2>Список учетных записей</h2>
      <ul>
        <li v-for="account in accounts" :key="account.id">
          {{ account.login }} ({{ account.type }})
          <button @click="editAccount(account.id)">Редактировать</button>
          <button @click="removeAccount(account.id)">Удалить</button>
        </li>
      </ul>
      <button @click="goToAddAccount">Добавить учетную запись</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useAccountsStore } from '@/pinia/account';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const accountsStore = useAccountsStore();
      const router = useRouter();
  
      const removeAccount = (id: string) => {
        accountsStore.removeAccount(id);
      };
  
      const editAccount = (id: string) => {
        router.push(`/edit/${id}`);
      };
  
      const goToAddAccount = () => {
        router.push('/add');
      };
  
      return {
        accounts: accountsStore.accounts,
        removeAccount,
        editAccount,
        goToAddAccount,
      };
    },
  });
  </script>