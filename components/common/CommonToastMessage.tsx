import { useEffect, useState } from 'react';

import { useToastMessage } from '@/stores/useCommon';

export function CommonToastMessage() {
  const [visible, setVisible] = useState(false);

  const colorClass = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const { toast, hideToast } = useToastMessage();

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const hideTimeout = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          hideToast();
        }, 300);
      }, toast.delay);

      return () => {
        clearTimeout(hideTimeout);
      };
    }
  }, [toast, hideToast]);

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`fixed left-0 bottom-0 w-screen p-5 transition-opacity duration-300 z-20 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p
        className={`w-full h-12 rounded-xl text-xl flex justify-center items-center ${
          colorClass[toast.color]
        } text-white`}
      >
        {toast.message}
      </p>
    </div>
  );
}
