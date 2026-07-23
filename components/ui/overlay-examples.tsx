/**
 * OVERLAY SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates proper usage of the overlay components.
 * These examples should NOT be imported into production code.
 * They serve as documentation and testing reference.
 */

import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Dialog,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  ToastContainer,
  ToastProvider,
} from './index';
import { Button } from './button';
import { Input } from './input';
import { useToast } from '@/lib/hooks/use-toast';

/**
 * EXAMPLE 1: Basic Modal
 */
export const BasicModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal open={isOpen} onOpenChange={setIsOpen} size="md">
        <ModalHeader>
          <ModalTitle>Welcome to Placify</ModalTitle>
          <ModalDescription>
            This is a modal dialog with glass morphism effects and smooth animations.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-body-sm text-text-secondary">
            Modal content goes here. This modal supports focus trap, ESC key to close,
            and click outside to dismiss.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

/**
 * EXAMPLE 2: Dialog (Confirm/Cancel pattern)
 */
export const DialogExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleConfirm = async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="danger">
        Delete Account
      </Button>
      
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      >
        <p className="text-body-sm text-text-secondary">
          All your data including roadmaps, progress, and settings will be permanently deleted.
        </p>
      </Dialog>
    </>
  );
};

/**
 * EXAMPLE 3: Drawer (Right side)
 */
export const DrawerExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
      
      <Drawer open={isOpen} onOpenChange={setIsOpen} side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage your account settings and preferences.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
            />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Save Changes
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};

/**
 * EXAMPLE 4: Bottom Drawer (Mobile-friendly)
 */
export const BottomDrawerExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Filters</Button>
      
      <Drawer open={isOpen} onOpenChange={setIsOpen} side="bottom">
        <DrawerHeader>
          <DrawerTitle>Filter Options</DrawerTitle>
          <DrawerDescription>
            Customize your view with filters.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-body-sm text-text-secondary">
            Filter controls would go here.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Reset
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Apply Filters
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};

/**
 * EXAMPLE 5: Toast Notifications
 */
export const ToastExample: React.FC = () => {
  const { success, error, warning, info, loading, update } = useToast();

  const handleSuccess = () => {
    success('Success!', 'Your changes have been saved successfully.');
  };

  const handleError = () => {
    error('Error occurred', 'Failed to save your changes. Please try again.');
  };

  const handleWarning = () => {
    warning('Warning', 'Your session is about to expire in 5 minutes.');
  };

  const handleInfo = () => {
    info('New feature available', 'Check out the new roadmap visualization!');
  };

  const handleLoading = () => {
    const id = loading('Processing...', 'This may take a few moments.');
    
    // Simulate async operation
    setTimeout(() => {
      update(id, {
        variant: 'success',
        title: 'Completed!',
        description: 'Processing finished successfully.',
        duration: 3000,
      });
    }, 3000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleSuccess} variant="primary">
        Show Success
      </Button>
      <Button onClick={handleError} variant="danger">
        Show Error
      </Button>
      <Button onClick={handleWarning} variant="secondary">
        Show Warning
      </Button>
      <Button onClick={handleInfo} variant="secondary">
        Show Info
      </Button>
      <Button onClick={handleLoading} variant="primary">
        Show Loading
      </Button>
    </div>
  );
};

/**
 * EXAMPLE 6: Complete App Setup
 */
export const OverlaySystemDemo: React.FC = () => {
  return (
    <ToastProvider maxToasts={5}>
      <div className="min-h-screen bg-surface-background p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-h3 font-semibold text-text-primary mb-4">
              Overlay System Demo
            </h2>
            <p className="text-body-md text-text-secondary mb-8">
              Complete implementation of Placify&apos;s overlay system with all components.
            </p>
          </section>

          <section>
            <h3 className="text-h5 font-semibold text-text-primary mb-4">
              Modal
            </h3>
            <BasicModalExample />
          </section>

          <section>
            <h3 className="text-h5 font-semibold text-text-primary mb-4">
              Dialog
            </h3>
            <DialogExample />
          </section>

          <section>
            <h3 className="text-h5 font-semibold text-text-primary mb-4">
              Drawer (Right)
            </h3>
            <DrawerExample />
          </section>

          <section>
            <h3 className="text-h5 font-semibold text-text-primary mb-4">
              Drawer (Bottom)
            </h3>
            <BottomDrawerExample />
          </section>

          <section>
            <h3 className="text-h5 font-semibold text-text-primary mb-4">
              Toast Notifications
            </h3>
            <ToastExample />
          </section>
        </div>
      </div>

      {/* Toast container must be rendered once in your app */}
      <ToastContainer position="top-right" />
    </ToastProvider>
  );
};
