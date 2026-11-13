import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? XCircle
            : toast.type === 'warning'
            ? AlertTriangle
            : Info;

        const borderBg =
          toast.type === 'success'
            ? 'border-[#BBF7D0] bg-white text-[#16A34A]'
            : toast.type === 'error'
            ? 'border-[#FECACA] bg-white text-[#DC2626]'
            : toast.type === 'warning'
            ? 'border-[#FDE68A] bg-white text-[#D97706]'
            : 'border-[#E9E2F5] bg-white text-[#8B5CF6]';

        return (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl border shadow-lg backdrop-blur-xs pointer-events-auto flex items-start justify-between space-x-3 text-xs transition-all ${borderBg}`}
          >
            <div className="flex items-start space-x-2.5">
              <Icon className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#171717]">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-[#52525B] mt-0.5 leading-snug">
                    {toast.message}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#71717A] hover:text-[#171717] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
