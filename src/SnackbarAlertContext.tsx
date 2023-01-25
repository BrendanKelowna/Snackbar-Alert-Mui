import { createContext, PropsWithChildren, useContext } from "react";
import useSnackbarAlert, { SnackbarAlertState } from "./useSnackbarAlert";

//* Types
export type SnackbarAlertContextProps = PropsWithChildren<Record<string, never>>;

const SnackbarAlertContext = createContext<SnackbarAlertState | null>(null);

export function useSnackbarAlertContext() {
  return useContext(SnackbarAlertContext);
}

export function SnackbarAlertProvider({ children }: SnackbarAlertContextProps) {
  const state = useSnackbarAlert();

  return (
    <SnackbarAlertContext.Provider value={state}>
      {children}
    </SnackbarAlertContext.Provider>
  );
}
