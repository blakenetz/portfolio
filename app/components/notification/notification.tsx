import { Notification as MantineNotification } from "@mantine/core";

import { Status } from "~/utils";

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
  handleClose: VoidFunction;
}

const messages = new Map<Status, string | null>([
  ["octokit-fail", "We seemed to hit a snag fetching data from Github."],
  ["ok", null],
  ["unknown", "Something has gone horrible wrong, so we sent you home."],
]);

export default function Notification({
  hide,
  status,
  handleClose,
}: NotificationProps) {
  if (hide === true) return null;

  const message = messages.get(status);

  return (
    message && (
      <MantineNotification
        title="Sorry!"
        onClose={handleClose}
        color="red"
        className={styles.notification}
        withBorder
      >
        {message}
      </MantineNotification>
    )
  );
}
