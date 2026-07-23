import * as React from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type ToastActionType =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; id: string; toast: Partial<Toast> }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'REMOVE_TOAST'; id: string };

interface ToastState {
  toasts: Toast[];
}

const toastReducer = (state: ToastState, action: ToastActionType): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, duration: 0 } : t
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
    default:
      return state;
  }
};

type ToastContextValue = {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
  update: (id: string, props: Partial<Toast>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

let toastCount = 0;

const generateToastId = () => {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${toastCount}-${Date.now()}`;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Maximum number of toasts to show at once
   * @default 5
   */
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = React.useCallback(
    (props: Omit<Toast, 'id'>) => {
      const id = generateToastId();
      const toastWithId: Toast = {
        id,
        duration: 5000,
        ...props,
      };

      dispatch({ type: 'ADD_TOAST', toast: toastWithId });

      // Limit number of toasts
      if (state.toasts.length >= maxToasts) {
        const oldestId = state.toasts[state.toasts.length - 1].id;
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', id: oldestId });
        }, 100);
      }

      return id;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxToasts]
  );

  const success = React.useCallback(
    (title: string, description?: string) => {
      return toast({ variant: 'success', title, description });
    },
    [toast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      return toast({ variant: 'error', title, description });
    },
    [toast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => {
      return toast({ variant: 'warning', title, description });
    },
    [toast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      return toast({ variant: 'info', title, description });
    },
    [toast]
  );

  const loading = React.useCallback(
    (title: string, description?: string) => {
      return toast({ variant: 'loading', title, description, duration: 0 });
    },
    [toast]
  );

  const update = React.useCallback((id: string, props: Partial<Toast>) => {
    dispatch({ type: 'UPDATE_TOAST', id, toast: props });
  }, []);

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  const contextValue = React.useMemo(
    () => ({
      toasts: state.toasts,
      toast,
      success,
      error,
      warning,
      info,
      loading,
      update,
      dismiss,
    }),
    [state.toasts, toast, success, error, warning, info, loading, update, dismiss]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
