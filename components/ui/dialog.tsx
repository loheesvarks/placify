import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from './modal';
import { Button } from './button';

export interface DialogProps {
  /**
   * Controls whether dialog is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Default open state
   */
  defaultOpen?: boolean;
  /**
   * Dialog title
   */
  title: string;
  /**
   * Dialog description
   */
  description?: string;
  /**
   * Dialog content
   */
  children?: React.ReactNode;
  /**
   * Confirm button text
   * @default 'Confirm'
   */
  confirmText?: string;
  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;
  /**
   * Callback when confirm is clicked
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void;
  /**
   * Whether confirm button is loading
   */
  loading?: boolean;
  /**
   * Confirm button variant
   * @default 'primary'
   */
  confirmVariant?: 'primary' | 'danger';
  /**
   * Dialog size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether to show cancel button
   * @default true
   */
  showCancel?: boolean;
  /**
   * Whether clicking outside closes the dialog
   * @default false (safer for confirm dialogs)
   */
  closeOnClickOutside?: boolean;
}

/**
 * Dialog component built on Modal with confirm/cancel pattern
 * Perfect for confirmation dialogs, alerts, and simple forms
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  defaultOpen,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  confirmVariant = 'primary',
  size = 'md',
  showCancel = true,
  closeOnClickOutside = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const handleClose = () => {
    // Only allow close via backdrop/ESC if not loading
    if (!isLoading && !loading) {
      onOpenChange?.(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      size={size}
      closeOnClickOutside={closeOnClickOutside && !isLoading && !loading}
      closeOnEscape={!isLoading && !loading}
      showCloseButton={!isLoading && !loading}
      onClose={handleClose}
    >
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {description && <ModalDescription>{description}</ModalDescription>}
      </ModalHeader>

      {children && <ModalBody>{children}</ModalBody>}

      <ModalFooter>
        {showCancel && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading || loading}
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={confirmVariant}
          onClick={handleConfirm}
          loading={isLoading || loading}
          disabled={isLoading || loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

Dialog.displayName = 'Dialog';
