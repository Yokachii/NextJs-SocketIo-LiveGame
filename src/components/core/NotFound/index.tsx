import { Container, Title, Text, Button, SimpleGrid } from "@mantine/core";
import image from "./image.svg";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

export function NotFound() {
  return (
    <Container className={styles.root__class}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image alt="" src={image} className={styles.mobileImage} />
        <div>
          <Title className={styles.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the page has
            been moved to another URL. If you think this is an error contact support.
          </Text>
          <Link href="/">
            <Button variant="outline" size="md" mt="xl" className={styles.control}>
              Get back to home page
            </Button>
          </Link>
        </div>
        <Image alt="" src={image} className={styles.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}
