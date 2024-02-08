import { Container, Title, Button, Group, Text, List, ThemeIcon, rem } from "@mantine/core";
import { IconCheck, IconCurrencyDollar, IconX } from "@tabler/icons-react";
import Image from "next/image";
import image from "./image.svg";
import styles from "./index.module.scss";

export function Hero() {
  return (
    <Container size="md">
      <div className={styles.inner}>
        <div className={styles.content}>
          <Title className={styles.title}>
            Use <span className={styles.highlight}>Oxie</span> or easily setup <br /> your own bot
          </Title>
          <Text c="dimmed" mt="md" fz="17px">
            Oxie is a versatile bot that can work wonders on your server - You have security problems or you
            want a bot to help you with a difficult task on your server then invite Oxie, he will help you.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Free</b> – Use the free version of Oxie, which lets you use lots of commands and much more.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCurrencyDollar style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <b>Premium</b> – the taste of the vip class, with special things and more commands than the
              normal version
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <b>Create own bot</b> – Not available for the moment, but estimated for 2025
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="md" size="md" variant="gradient" className={styles.control}>
              Premium
            </Button>
            <Button variant="outline" radius="xl" size="md" className={styles.control}>
              Invite
            </Button>
          </Group>
        </div>
        <Image alt="" quality={95} src={image} className={styles.image} />
      </div>
    </Container>
  );
}
