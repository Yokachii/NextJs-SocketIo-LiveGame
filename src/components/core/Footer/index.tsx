import { Anchor, Group, ActionIcon, rem } from "@mantine/core";
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconDatabase } from "@tabler/icons-react";
import styles from "./index.module.scss";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Careers" },
];

export function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.inner}>
        <IconDatabase size={28} />

        <Group className={styles.links}>
          {links.map((link) => (
            <Anchor
              c="dimmed"
              key={link.label}
              href={link.link}
              lh={1}
              onClick={(event) => event.preventDefault()}
              size="sm"
            >
              {link.label}
            </Anchor>
          ))}
        </Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
