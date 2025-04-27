import { useAccountsStore } from 'D:/front/account-manager/src/stores/account.ts';

export function useAccounts() {
  const accountsStore = useAccountsStore();

  const addAccount = (account: any) => {
    accountsStore.addAccount(account);
  };

  const removeAccount = (id: string) => {
    accountsStore.removeAccount(id);
  };

  const updateAccount = (id: string, updatedAccount: any) => {
    accountsStore.updateAccount(id, updatedAccount);
  };

  return {
    accounts: accountsStore.accounts,
    addAccount,
    removeAccount,
    updateAccount,
  };
}