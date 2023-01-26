import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SnackbarAlert from "../SnackbarAlert";
import {
  SnackbarAlertContextAdd,
  SnackbarAlertContextState,
  SnackbarAlertProvider,
  useSnackbarAlertAddContext,
  useSnackbarAlertContext,
} from "../SnackbarAlertContext";
import useSnackbarAlert, {
  SnackbarAlertMessage,
  SnackbarAlertState,
} from "../useSnackbarAlert";

//* Mocks
// Messages
const mockMessage = (title: string): SnackbarAlertMessage => ({
  title,
  severity: "success",
  message: "test",
  undo: () => {},
});

// SnackbarAlert
function MockSnackbarAlertWithState({ state }: { state: SnackbarAlertState }) {
  const newState = useSnackbarAlert();
  Object.assign(state, newState);

  return (
    <SnackbarAlert
      isOpen={newState.isOpen}
      message={newState.message}
      close={newState.close}
      closed={newState.closed}
    />
  );
}

// SnackbarAlertBase
function MockSnackbarAlertWithContext({
  services,
  state,
}: {
  services: { add: SnackbarAlertContextAdd };
  state: SnackbarAlertContextState;
}) {
  const newState = useSnackbarAlertContext();
  Object.assign(state, newState);
  const newServices = { add: useSnackbarAlertAddContext() };
  Object.assign(services, newServices);

  return (
    <SnackbarAlert
      isOpen={newState.isOpen}
      message={newState.message}
      close={newState.close}
      closed={newState.closed}
    />
  );
}

describe("Snackbar Alert tests", () => {
  test("Initial render", () => {
    render(<SnackbarAlert />);

    const alert = screen.queryByRole("alert", { hidden: true });

    expect(alert).toBeNull();
  });

  describe("Snackbar Alert hook tests", () => {
    test("Undo alert test", async () => {
      const state = {} as SnackbarAlertState;
      render(<MockSnackbarAlertWithState state={state} />);

      act(() => state.add(mockMessage("test")));

      const alert = screen.getByRole("alert", { hidden: true });

      await waitFor(() => expect(alert).toBeVisible());
      expect(screen.getByRole("button", { name: "Undo" })).toBeVisible();
    });

    test("Multiple alerts test", async () => {
      const state = {} as SnackbarAlertState;
      render(<MockSnackbarAlertWithState state={state} />);

      // Add 3 alerts
      act(() => state.add(mockMessage("test1")));
      act(() => state.add(mockMessage("test2")));
      act(() => state.add(mockMessage("test3")));

      // Wait for first alert and close
      await waitFor(() => expect(screen.getByText("test1")).toBeVisible());
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // Wait for second alert and Close
      await waitFor(() => expect(screen.getByText("test2")).toBeVisible());
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // Wait for third alert and Close
      await waitFor(() => expect(screen.getByText("test3")).toBeVisible());
      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      // Wait for all alerts to be removed
      await waitFor(() => expect(screen.getByRole("alert")).not.toBeVisible());
    });
  });

  describe("Page loading context tests", () => {
    test("Context test", async () => {
      const services = {} as { add: SnackbarAlertContextAdd };
      const state = {} as SnackbarAlertContextState;
      render(
        <SnackbarAlertProvider>
          <MockSnackbarAlertWithContext services={services} state={state} />
        </SnackbarAlertProvider>
      );

      let alert = screen.queryByRole("alert", { hidden: true });

      expect(alert).toBeNull();

      act(() => services.add(mockMessage("test1")));

      alert = screen.queryByRole("alert", { hidden: true });

      await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    });
  });
});
