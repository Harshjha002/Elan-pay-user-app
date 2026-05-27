import { create } from "zustand";

type BalanceStore = {
  balance: number;
  setBalance: (amount: number) => void;
};

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: 5000,
  setBalance: (amount) => set({ balance: amount }),
}));