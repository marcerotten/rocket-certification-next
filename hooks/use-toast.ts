import { useCallback, useState } from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const toastStore: Map<string, Toast> = new Map();
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useToast = () => {
  const [, setUpdates] = useState(0);

  const forceUpdate = useCallback(() => {
    setUpdates((prev) => prev + 1);
  }, []);

  const addListener = useCallback(() => {
    const listener = () => forceUpdate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [forceUpdate]);

  // Subscribe to changes
  addListener();

  const toasts = Array.from(toastStore.values());

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toastStore.delete(toastId);
    } else {
      toastStore.clear();
    }
    notifyListeners();
  }, []);

  return {
    toasts,
    dismiss,
  };
};

export const toast = (props: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastStore.set(id, { id, ...props });
  notifyListeners();

  return {
    dismiss: () => {
      toastStore.delete(id);
      notifyListeners();
    },
  };
};
