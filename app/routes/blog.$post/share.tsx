import { Title } from "@mantine/core";

import { cls } from "~/utils";

import styles from "./post.module.css";

export default function Share() {
	return (
		<section className={cls(styles.flex, styles.comments)}>
			<Title order={3}>Share</Title>
		</section>
	);
}
