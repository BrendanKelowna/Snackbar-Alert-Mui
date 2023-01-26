import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SnackbarAlert from "../SnackbarAlert";
import {
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
function MockSnackbarAlert() {
  const { isOpen, message, add, close, closed } = useSnackbarAlert();

  return (
    <div>
      <button type="button" onClick={() => add(mockMessage("Test Title"))}>
        addUndo
      </button>

      <SnackbarAlert isOpen={isOpen} message={message} close={close} closed={closed} />
    </div>
  );
}

// SnackbarAlertBase
function MockSnackbarAlertBase() {
  const { isOpen, message, close, closed } = useSnackbarAlertContext();
  const add = useSnackbarAlertAddContext();
  return (
    <div>
      <button type="button" onClick={() => add(mockMessage("Test Title"))}>
        addUndo
      </button>

      <SnackbarAlert isOpen={isOpen} message={message} close={close} closed={closed} />
    </div>
  );
}

// SnackbarAlertContext
function MockSnackbarAlertContext() {
  return (
    <div>
      <SnackbarAlertProvider>
        <MockSnackbarAlertBase />
      </SnackbarAlertProvider>
    </div>
  );
}

describe("Snackbar Tests", () => {
  test("Initial render test", () => {
    render(<MockSnackbarAlert />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("Undo alert test", async () => {
    render(<MockSnackbarAlert />);

    const addUndo = screen.getByRole("button", { name: "addUndo" });

    userEvent.click(addUndo);

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
    );
  });

  test("Multiple alerts test", async () => {
    render(<MockSnackbarAlert />);

    const addUndo = screen.getByRole("button", { name: "addUndo" });

    // Add 3 alerts
    userEvent.click(addUndo);
    userEvent.click(addUndo);
    userEvent.click(addUndo);

    // Wait for first alert
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    // Close first alert
    userEvent.click(screen.getByRole("button", { name: "Close" }));

    // Close second alert
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
    );
    userEvent.click(screen.getByRole("button", { name: "Close" }));

    // Close third alert
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
    );
    userEvent.click(screen.getByRole("button", { name: "Close" }));

    // Wait for all alerts to be removed
    await waitFor(() => expect(screen.getByRole("alert")).not.toBeVisible());
    // await waitForElementToBeRemoved(
    //   () => expect(screen.getByRole("alert")).not.toBeInTheDocument(),
    //   { timeout: 5000 }
    // );
  });

  test("Context test", async () => {
    render(<MockSnackbarAlertContext />);

    const addUndo = screen.getByRole("button", { name: "addUndo" });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    userEvent.click(addUndo);

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
