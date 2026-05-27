"use client";

import { useBalanceStore } from "@/store/balance-store";

const CheckBalance = () => {
  const balance = useBalanceStore((state) => state.balance);

  return <div>Balance = {balance}</div>;
};

export default CheckBalance;