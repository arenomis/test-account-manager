import { defineStore } from 'pinia';

export interface Account {
  id: string;
  type: 'Local' | 'LDAP';
  login: string;
  password?: string;
  tags: { text: string }[];
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push({ ...account, id: String(Date.now()) });
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((account) => account.id !== id);
    },
    updateAccount(id: string, updatedAccount: Partial<Account>) {
      const account = this.accounts.find((a) => a.id === id);
      if (account) {
        Object.assign(account, updatedAccount);
      }
    },
  },
});