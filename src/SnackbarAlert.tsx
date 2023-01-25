import CloseIcon from "@mui/icons-material/Close";
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle,
  AlertTitleProps,
  Button,
  CSSObject,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarProps,
  Typography,
} from "@mui/material";
import { SyntheticEvent } from "react";
import { SnackbarAlertMessage } from "./useSnackbarAlert";

//* Types
export type SnackbarAlertProps = {
  isOpen: boolean;
  message?: SnackbarAlertMessage | null;
  close: () => void;
  closed: () => void;
  alertProps?: MuiAlertProps;
  alertTitleProps?: AlertTitleProps;
  snackbarProps?: SnackbarProps;
};

//* Styles
const css = {
  background: "primary.main",
  color: "primary.contrastText",
} as CSSObject;

/**
 * Props for the SnackbarAlert component
 * @param isOpen Whether the snackbar is open
 * @param message The message to display
 * @param message.title *** Title is not used in a snackbar without an alert
 * @param close Function to close the snackbar
 * @param closed Function to be called when the snackbar is closed
 * @param alertProps Props to pass to the Alert component
 * @param alertTitleProps Props to pass to the AlertTitle component
 * @param snackbarProps Props to pass to the Snackbar component
 */
export default function SnackbarAlert({
  isOpen,
  message: messageInfo,
  close,
  closed,
  alertProps,
  alertTitleProps,
  snackbarProps,
}: SnackbarAlertProps) {
  //* Context

  //* State

  //* Handlers
  const handleOnClose = (
    event: Event | SyntheticEvent<unknown, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    close?.();
  };

  //* Renders
  // Alert or Normal Snackbar
  // props are totally different between the two
  const isAlert = !!messageInfo?.severity;

  const message = !isAlert ? messageInfo?.message : undefined;
  const title = !isAlert ? messageInfo?.title : undefined;

  const actions = messageInfo?.undo && [
    <Button
      aria-label="Undo"
      key="undoBtn"
      size="small"
      sx={{ color: "white" }}
      onClick={() => {
        messageInfo?.undo?.();
        close?.();
      }}
    >
      Undo
    </Button>,
    <IconButton
      key="closeBtn"
      size="small"
      sx={{ color: "white" }}
      onClick={() => close?.()} // close
      aria-label="Close"
      name="test"
    >
      <CloseIcon />
    </IconButton>,
  ];

  let body;

  if (isAlert) {
    body = <Typography key="message">{messageInfo?.message}</Typography>;

    if (messageInfo?.title)
      body = (
        <div>
          <AlertTitle {...alertTitleProps}>{messageInfo?.title}</AlertTitle>
          {body}
        </div>
      );

    body = (
      <MuiAlert
        onClose={handleOnClose}
        variant="filled"
        severity={messageInfo?.severity}
        action={actions}
        {...alertProps}
      >
        {body}
      </MuiAlert>
    );
  }

  return (
    <Snackbar
      key={messageInfo?.key}
      sx={css}
      open={isOpen}
      onClose={handleOnClose}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={actions}
      title={title}
      message={message}
      TransitionProps={{ onExited: closed }}
      {...snackbarProps}
    >
      {body}
    </Snackbar>
  );
}

SnackbarAlert.defaultProps = {
  alertProps: {},
  alertTitleProps: {},
  message: null,
  snackbarProps: {},
};
