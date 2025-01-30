import { Notification as MantineNotification } from "@mantine/core";

import { messages, Status, status as notificationStatus } from "~/utils";

import styles from "./notification.module.css";

interface NotificationProps {
  /**
   * Controls visibility state of notification
   */
  hide: boolean;

  /**
   * status set in url param
   */
  status: Status;

  /**
   * onClose handler
   */
  handleClose: () => void;
}

export default function Notification({
  hide,
  status,
  handleClose,
}: NotificationProps) {
  if (hide === true) return null;

  const message = messages.get(status);
  const isSuccess = status === notificationStatus["authSuccess"];

  return (
    message && (
      <MantineNotification
        title={isSuccess ? "Yay!" : "Sorry!"}
        onClose={handleClose}
        color={isSuccess ? "green" : "red"}
        className={styles.notification}
        withBorder
      >
        {message}
      </MantineNotification>
    )
  );
}
