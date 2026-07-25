import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";

interface VaultState {
  isUnlocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;
  // We don't store the password here, just the access state
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      isUnlocked: false,
      unlockVault: () => set({ isUnlocked: true }),
      lockVault: () => set({ isUnlocked: false }),
    }),
    {
      name: "re-manager-vault-storage",
    }
  )
);

export function useVault() {
  const isUnlocked = useVaultStore((state) => state.isUnlocked);
  const unlockVault = useVaultStore((state) => state.unlockVault);
  const lockVault = useVaultStore((state) => state.lockVault);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isUnlocked: mounted ? isUnlocked : false,
    unlockVault,
    lockVault,
    isMounted: mounted,
  };
}
