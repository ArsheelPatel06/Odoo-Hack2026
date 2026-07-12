"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Card } from "@/shared/components/ui";

type DialogOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DialogContextValue = {
  isOpen: boolean;
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogProviderProps = {
  children: React.ReactNode;
};

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const hideDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const showDialog = useCallback((options: DialogOptions) => {
    setDialog(options);
  }, []);

  const handleConfirm = () => {
    dialog?.onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    dialog?.onCancel?.();
    hideDialog();
  };

  return (
    <DialogContext.Provider value={{ isOpen: Boolean(dialog), showDialog, hideDialog }}>
      {children}
      {dialog && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur-sm">
              <Card role="dialog" aria-modal="true" aria-label={dialog.title} className="w-full max-w-md">
                <h2 className="text-lg font-semibold text-text">{dialog.title}</h2>
                {dialog.description ? <p className="mt-2 text-sm text-muted">{dialog.description}</p> : null}
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="secondary" type="button" onClick={handleCancel}>
                    {dialog.cancelLabel ?? "Cancel"}
                  </Button>
                  <Button variant={dialog.variant ?? "primary"} type="button" onClick={handleConfirm}>
                    {dialog.confirmLabel ?? "Confirm"}
                  </Button>
                </div>
              </Card>
            </div>,
            document.getElementById("dialog-root") ?? document.body
          )
        : null}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within DialogProvider.");
  }

  return context;
}
