import { AlertColor } from "@mui/material/Alert";
import { useState } from "react";

//* Types
export interface SnackbarAlertMessage {
  title?: string;
  message: string;
  severity?: AlertColor;
  undo?: () => unknown;
  key?: number;
}

export type SnackbarAlertState = ReturnType<typeof useSnackbarAlert>;

//* Definitions

//* Styling

//* Helpers

export default function useSnackbarAlert() {
  //* Context

  //* State
  const [messages, setMessages] = useState<readonly SnackbarAlertMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  //* Effects

  //* Handlers
  function handleAdd(message: SnackbarAlertMessage) {
    const messageWithKey = { ...message, key: Date.now() };
    setMessages((state) => [...state, messageWithKey]);
    setIsOpen(true);
  }

  // Close the active snack
  function handleClose() {
    setIsOpen(false);
  }

  // When the snack is finished closing, remove it from the queue
  function handleClosed() {
    setMessages((state) => {
      const newState = state.slice(1);

      if (newState.length > 0) setIsOpen(true);

      return newState;
    });
  }

  //* Renders
  return {
    isOpen,
    message: messages[0] as SnackbarAlertMessage | undefined,
    add: handleAdd,
    close: handleClose,
    closed: handleClosed,
    length: messages.length,
    messages,
  };
}
