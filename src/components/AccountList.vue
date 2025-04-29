<template>
  <div>
    <h2 class="mb-3">Список учетных записей</h2>
    <ul class="list-group" :key="accounts.length">
      <li
        v-for="account in accounts"
        :key="account.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>{{ account.login }} ({{ account.type }})</span>
        <div>
          <button
            @click="editAccount(account.id)"
            class="btn btn-warning btn-sm me-2"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            @click="removeAccount(account.id)"
            class="btn btn-danger btn-sm"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </li>
    </ul>
    <button @click="goToAddAccount" class="btn btn-success mt-3">
      <i class="bi bi-plus-circle"></i> Добавить учетную запись
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountsStore } from '../stores/account';

export default defineComponent({
  setup() {
    const accountsStore = useAccountsStore();
    const router = useRouter();

    const editAccount = (id: string) => {
      router.push(`/edit/${id}`);
    };

    const goToAddAccount = () => {
      router.push('/add');
    };

    return {
      accounts: computed(() => accountsStore.getAccounts),

      removeAccount: (id: string) => accountsStore.removeAccount(id),

      editAccount,
      goToAddAccount,
    };
  },
});
</script>