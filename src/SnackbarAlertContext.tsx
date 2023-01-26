import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import useSnackbarAlert, { SnackbarAlertMessage } from "./useSnackbarAlert";

// eslint-disable-next-line @typescript-eslint/ban-types
export type SnackbarAlertProviderProps = PropsWithChildren<{}>;

//* StateContext
export type SnackbarAlertContextState = {
  isOpen: boolean;
  message?: SnackbarAlertMessage;
  close: () => void;
  closed: () => void;
};

const defaultState: SnackbarAlertContextState = {
  isOpen: false,
  close: () => {},
  closed: () => {},
};

const StateContext = createContext<SnackbarAlertContextState>(defaultState);

export function useSnackbarAlertContext() {
  return useContext(StateContext);
}

//* AddContext
export type SnackbarAlertContextAdd = (message: SnackbarAlertMessage) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultAdd: SnackbarAlertContextAdd = (message: SnackbarAlertMessage) => {
  throw new Error("SnackbarAlert provider not found");
};

const AddContext = createContext<SnackbarAlertContextAdd>(defaultAdd);

export function useSnackbarAlertAddContext() {
  return useContext(AddContext);
}

export function SnackbarAlertProvider({ children }: SnackbarAlertProviderProps) {
  const { add, isOpen, message, close, closed, length, messages } = useSnackbarAlert();

  const state = useMemo(
    () => ({
      isOpen,
      message,
      close,
      closed,
      length,
      messages,
    }),
    [isOpen, message, close, closed, length, messages]
  );

  return (
    <StateContext.Provider value={state}>
      <AddContext.Provider value={add}>{children}</AddContext.Provider>
    </StateContext.Provider>
  );
}
