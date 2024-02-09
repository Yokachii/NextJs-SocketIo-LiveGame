import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCode,
  IconCoin,
  IconChevronDown,
  IconDatabase,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import cx from "clsx";
import styles from "./index.module.scss";
import Link from "next/link";
import { NavbarItem } from "@/types/data";
import { useSession, signIn, signOut } from "next-auth/react"

import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { redirect } from 'next/navigation';

const mockdata: NavbarItem[] = [
  {
    icon: IconCode,
    title: "Open source",
    description: "Oxie's code is open source and available to everyone.",
    link: "https://github.com/Oxie-Inc",
  },
  {
    icon: IconCoin,
    title: "Freenium",
    description: "You can start using Oxie right away and ugprade later.",
    link: "#test",
  },
];

export function Navbar() {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const open = (link: string) => {
    if (link.startsWith("#")) {
      const el = document
        .getElementById(link.slice(1))
        ?.getBoundingClientRect();
      const x = el?.x;
      const y = el?.y;

      window.scrollBy({ behavior: "smooth", top: y, left: x });
    } else {
      window.open(link, "_blank");
    }
  };

  const { data: session } = useSession()
  console.log(session)

  const links = mockdata.map((item: NavbarItem) => (
    <UnstyledButton
      onClick={() => item.link && open(item.link)}
      className={styles.subLink}
      key={item.title}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(24), height: rem(24) }}
            color={theme.colors.blue[6]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={600}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={120}>
      <header className={styles.header}>
        <Group justify="space-between" h="100%">
          <IconDatabase size={30} />

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={styles.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={3}
                      color={theme.colors.blue[6]}
                      className={styles.iconChevron}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  {/* <Anchor href="#" fz="xs">
                    View all
                  </Anchor> */}
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing="sm">
                  {links}
                </SimpleGrid>

                <div className={styles.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={styles.link}>
              FAQ
            </a>
            <a href="#" className={styles.link}>
              About us
            </a>
          </Group>

          <Group visibleFrom="sm">
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === "dark" ? (
                <IconMoon className={cx("icon", "classes.dark")} stroke={1.5} />
              ) : (
                <IconSun className={cx("icon", "light")} stroke={1.5} />
              )}
            </ActionIcon>
            {session?.user?(
              <Button onClick={()=>{signOut()}}>Log out</Button>
            ):(
              <Link href="/login?type=login">
                <Button variant="default">Log in</Button>
              </Link>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/" className={styles.link}>
            Home
          </Link>
          <UnstyledButton className={styles.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                rotate={180}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={styles.link}>
            Learn
          </a>
          <a href="#" className={styles.link}>
            Academy
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              <IconMoon
                className={cx(
                  styles.icon,
                  colorScheme === "dark" ? styles.dark : styles.light
                )}
                stroke={1.5}
              />
            </ActionIcon>
            <Button onClick={() => signIn()} variant="default">
              Log in
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}