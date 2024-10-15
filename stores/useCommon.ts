import { create } from 'zustand';

interface Toast {
  message: string;
  color: 'success' | 'error';
  delay?: number;
}

interface ToastState {
  toast: Toast | null;
  showToast: (params: Toast) => void;
  hideToast: () => void;
}

export const useToastMessage = create<ToastState>((set) => ({
  toast: null,
  showToast: ({ message, color = 'success', delay = 3000 }) =>
    set({ toast: { message, color, delay } }),
  hideToast: () => set({ toast: null }),
}));

interface AsyncLoadingSpinnerState {
  loading: boolean;
  showLoadingSpinner: () => void;
  hideLoadingSpinner: () => void;
}

export const useAsyncLoadingSpinner = create<AsyncLoadingSpinnerState>((set) => ({
  loading: false,
  showLoadingSpinner: () => set({ loading: true }),
  hideLoadingSpinner: () => set({ loading: false }),
}));
