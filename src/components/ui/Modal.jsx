import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react';

// Contexto para gerenciar modals
const ModalContext = createContext(null);

// Tipos de modal
const MODAL_TYPES = {
  confirm: {
    icon: HelpCircle,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100',
  },
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100',
  },
};

// Componente Modal
const ModalComponent = ({ modal, onClose }) => {
  if (!modal) return null;

  const config = MODAL_TYPES[modal.type] || MODAL_TYPES.confirm;
  const Icon = config.icon;

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
          {/* Close button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center mb-4`}>
              <Icon className={config.iconColor} size={24} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {modal.title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center text-sm whitespace-pre-line">
              {modal.message}
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3 justify-center">
              {modal.showCancel !== false && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {modal.cancelText || 'Cancelar'}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  modal.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {modal.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Provider
export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showModal = useCallback((options) => {
    return new Promise((resolve) => {
      setModal({
        ...options,
        onConfirm: () => {
          if (options.onConfirm) options.onConfirm();
          resolve(true);
        },
        onCancel: () => {
          if (options.onCancel) options.onCancel();
          resolve(false);
        },
      });
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const modalActions = {
    confirm: (title, message, options = {}) =>
      showModal({ type: 'confirm', title, message, ...options }),
    warning: (title, message, options = {}) =>
      showModal({ type: 'warning', title, message, ...options }),
    danger: (title, message, options = {}) =>
      showModal({ type: 'danger', title, message, confirmText: 'Excluir', ...options }),
    info: (title, message, options = {}) =>
      showModal({ type: 'info', title, message, showCancel: false, confirmText: 'OK', ...options }),
    success: (title, message, options = {}) =>
      showModal({ type: 'success', title, message, showCancel: false, confirmText: 'OK', ...options }),
  };

  return (
    <ModalContext.Provider value={modalActions}>
      {children}
      <ModalComponent modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

// Hook para usar modal
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de ModalProvider');
  }
  return context;
}

export default ModalProvider;
