import { createContext, PropsWithChildren, useContext } from "react";
import useSnackbarAlert, { SnackbarAlertMessage } from "./useSnackbarAlert";

// eslint-disable-next-line @typescript-eslint/ban-types
export type SnackbarAlertProviderProps = PropsWithChildren<{}>;

//* StateContext
type State = {
  isOpen: boolean;
  message?: SnackbarAlertMessage;
  close: () => void;
  closed: () => void;
};

const defaultState: State = {
  isOpen: false,
  close: () => {},
  closed: () => {},
};

const StateContext = createContext<State>(defaultState);

export function useSnackbarAlertContext() {
  return useContext(StateContext);
}

//* AddContext
type Add = (message: SnackbarAlertMessage) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultAdd: Add = (message: SnackbarAlertMessage) => {
  throw new Error("SnackbarAlert provider not found");
};

const AddContext = createContext<Add>(defaultAdd);

export function useSnackbarAlertAddContext() {
  return useContext(AddContext);
}

export function SnackbarAlertProvider({ children }: SnackbarAlertProviderProps) {
  const { add, ...state } = useSnackbarAlert();

  return (
    <StateContext.Provider value={state}>
      <AddContext.Provider value={add}>{children}</AddContext.Provider>
    </StateContext.Provider>
  );
}
